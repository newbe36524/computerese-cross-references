/**
 * Multi-format data.yaml converter CLI.
 * Ported from scripts/convert_data.py
 *
 * Converts data.yaml into various output formats including:
 * - CSV
 * - Markdown
 * - HTML
 * - Word (.docx)
 * - PDF
 */

import type { DataYaml, ConverterFunction } from '../types/index.js';
import { loadDataYaml, countTotalTerms } from '../common/loadDataYaml.js';

// Supported formats
const SUPPORTED_FORMATS = ['csv', 'markdown', 'html', 'docx', 'pdf'] as const;
export type SupportedFormat = typeof SUPPORTED_FORMATS[number];

// Format to output filename mapping
const OUTPUT_FILES: Record<SupportedFormat, string> = {
  csv: 'terms.csv',
  markdown: 'terms.md',
  html: 'terms.html',
  docx: 'terms.docx',
  pdf: 'terms.pdf',
};

/**
 * Get available converters (lazy-loaded).
 *
 * @returns Dictionary mapping format names to converter functions
 */
async function getConverters(): Promise<Record<SupportedFormat, ConverterFunction>> {
  const converters: Partial<Record<SupportedFormat, ConverterFunction>> = {};

  // CSV converter (no external dependencies)
  const { convertToCsv } = await import('../converters/csvConverter.js');
  converters.csv = convertToCsv;

  // Markdown converter (requires handlebars)
  try {
    const { convertToMarkdown } = await import('../converters/markdownConverter.js');
    converters.markdown = convertToMarkdown;
  } catch (error) {
    console.error(`Warning: Markdown converter not available - ${error}`);
  }

  // HTML converter (requires handlebars)
  try {
    const { convertToHtml } = await import('../converters/htmlConverter.js');
    converters.html = convertToHtml;
  } catch (error) {
    console.error(`Warning: HTML converter not available - ${error}`);
  }

  // DOCX converter (requires docx)
  try {
    const { convertToDocx } = await import('../converters/docxConverter.js');
    converters.docx = convertToDocx;
  } catch (error) {
    console.error(`Warning: DOCX converter not available - ${error}`);
  }

  // PDF converter (requires puppeteer)
  try {
    const { convertToPdf } = await import('../converters/pdfConverter.js');
    converters.pdf = convertToPdf;
  } catch (error) {
    console.error(`Warning: PDF converter not available - ${error}`);
  }

  return converters as Record<SupportedFormat, ConverterFunction>;
}

/**
 * Determine which formats to convert based on input.
 *
 * @param formats - List of format strings from command line
 * @returns List of formats to convert
 */
export function getFormatsToConvert(formats: string[]): SupportedFormat[] {
  if (formats.includes('all')) {
    return [...SUPPORTED_FORMATS];
  }
  // Remove duplicates while preserving order
  const seen = new Set<string>();
  const result: SupportedFormat[] = [];

  for (const fmt of formats) {
    if (SUPPORTED_FORMATS.includes(fmt as SupportedFormat) && !seen.has(fmt)) {
      seen.add(fmt);
      result.push(fmt as SupportedFormat);
    }
  }

  return result;
}

/**
 * Main conversion function.
 *
 * @param yamlPath - Path to data.yaml file
 * @param outputDir - Output directory
 * @param formats - Formats to convert
 * @param dryRun - Validate without generating files
 * @param verbose - Show detailed progress
 * @returns Exit code (0 for success, 1 for failure)
 */
export async function convertData(
  yamlPath: string,
  outputDir: string,
  formats: string[],
  dryRun: boolean,
  verbose: boolean
): Promise<number> {
  const formatsToConvert = getFormatsToConvert(formats);

  if (verbose) {
    console.log(`Formats to convert: ${formatsToConvert.join(', ')}`);
    console.log(`Output directory: ${outputDir}`);
    console.log(`data.yaml path: ${yamlPath}`);
    console.log();
  }

  // Validate data.yaml exists
  const { existsSync } = await import('fs');
  if (!existsSync(yamlPath)) {
    console.error(`Error: data.yaml not found at ${yamlPath}`);
    return 1;
  }

  // Load data.yaml
  let data: DataYaml;
  try {
    if (verbose) {
      console.log(`Loading ${yamlPath}...`);
    }
    data = loadDataYaml(yamlPath);
    if (verbose) {
      console.log(`Loaded ${countTotalTerms(data)} terms.`);
      console.log();
    }
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    return 1;
  }

  // Dry run - just validate
  if (dryRun) {
    console.log('Dry run: Validation successful!');
    console.log(`  - ${countTotalTerms(data)} terms loaded`);
    console.log(`  - ${formatsToConvert.length} format(s) would be generated`);
    return 0;
  }

  // Perform conversions
  const { join } = await import('path');
  let successCount = 0;

  // Get available converters (lazy-loaded)
  const converters = await getConverters();

  for (const fmt of formatsToConvert) {
    try {
      const outputPath = join(outputDir, OUTPUT_FILES[fmt]);
      if (verbose) {
        console.log(`Converting to ${fmt.toUpperCase()}...`);
      }

      await converters[fmt](data, outputPath);
      successCount++;
    } catch (error) {
      console.error(`Error converting to ${fmt.toUpperCase()}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  console.log();
  console.log(`Conversion complete: ${successCount}/${formatsToConvert.length} formats generated.`);

  return successCount === formatsToConvert.length ? 0 : 1;
}
