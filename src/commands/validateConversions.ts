/**
 * Validation script for converted outputs.
 * Ported from scripts/validate_conversions.py
 *
 * This script verifies that all generated output formats maintain data integrity
 * relative to the source data.yaml file.
 */

import { existsSync, statSync, readFileSync } from 'fs';
import { resolve } from 'path';
import type { DataYaml } from '../types/index.js';
import { loadDataYaml, countTotalTerms, validateFootnoteIntegrity } from '../common/loadDataYaml.js';

// Supported formats
const SUPPORTED_FORMATS = ['csv', 'markdown', 'html', 'docx', 'pdf'] as const;
type SupportedFormat = typeof SUPPORTED_FORMATS[number];

// Expected output files
const OUTPUT_FILES: Record<SupportedFormat, string> = {
  csv: 'terms.csv',
  markdown: 'terms.md',
  html: 'terms.html',
  docx: 'terms.docx',
  pdf: 'terms.pdf',
};

/**
 * Validate CSV output for term count and basic integrity.
 *
 * @param outputPath - Path to CSV file
 * @param expectedTermCount - Expected number of terms
 * @returns Tuple of [isValid, message]
 */
function validateCsv(outputPath: string, expectedTermCount: number): [boolean, string] {
  if (!existsSync(outputPath)) {
    return [false, `File not found: ${outputPath}`];
  }

  try {
    const content = readFileSync(outputPath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());

    // Subtract header row
    const termCount = Math.max(0, lines.length - 1);

    if (termCount !== expectedTermCount) {
      return [false, `Term count mismatch: expected ${expectedTermCount}, got ${termCount}`];
    }

    return [true, `Valid: ${termCount} terms`];
  } catch (error) {
    return [false, `Error reading CSV: ${error instanceof Error ? error.message : String(error)}`];
  }
}

/**
 * Validate that an output file exists and is readable.
 *
 * @param outputPath - Path to output file
 * @param formatName - Format name for message
 * @returns Tuple of [isValid, message]
 */
function validateFileExists(outputPath: string, formatName: string): [boolean, string] {
  if (!existsSync(outputPath)) {
    return [false, `File not found: ${outputPath}`];
  }

  const stats = statSync(outputPath);

  if (!stats.isFile()) {
    return [false, `Path is not a file: ${outputPath}`];
  }

  if (stats.size === 0) {
    return [false, `File is empty: ${outputPath}`];
  }

  return [true, `Valid: ${formatName.toUpperCase()} file exists (${stats.size} bytes)`];
}

/**
 * Determine which formats to validate.
 *
 * @param formats - List of format strings from command line
 * @returns List of formats to validate
 */
function getFormatsToValidate(formats: string[]): SupportedFormat[] {
  if (formats.includes('all')) {
    return [...SUPPORTED_FORMATS];
  }
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
 * Main entry point for validate-conversions command.
 *
 * @param yamlPath - Path to data.yaml file
 * @param distDir - Output directory
 * @param formats - Formats to validate
 * @returns Exit code (0 for success, 1 for failure)
 */
export function validateConversions(
  yamlPath: string,
  distDir: string,
  formats: string[]
): number {
  const formatsToValidate = getFormatsToValidate(formats);

  // Load source data
  console.log(`Loading ${yamlPath}...`);

  let data: DataYaml;
  let expectedTermCount: number;

  try {
    data = loadDataYaml(yamlPath);
    expectedTermCount = countTotalTerms(data);
    console.log(`  Loaded ${expectedTermCount} terms`);
    console.log();
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    return 1;
  }

  // Validate footnote integrity
  console.log('Validating footnote integrity...');
  const [valid, msg] = validateFootnoteIntegrity(data);
  console.log(`  [${valid ? '✓' : '✗'}] ${msg}`);
  if (!valid) {
    return 1;
  }
  console.log();

  // Validate each format
  let allPassed = true;
  const results: Record<SupportedFormat, [boolean, string]> = {} as any;

  for (const fmt of formatsToValidate) {
    const outputPath = resolve(distDir, OUTPUT_FILES[fmt]);

    let result: [boolean, string];
    if (fmt === 'csv') {
      result = validateCsv(outputPath, expectedTermCount);
    } else {
      // For other formats, just check file exists and is readable
      result = validateFileExists(outputPath, fmt);
    }

    results[fmt] = result;
    if (!result[0]) {
      allPassed = false;
    }
  }

  // Print results
  console.log('Format Validation Results:');
  console.log('-'.repeat(50));

  for (const fmt of formatsToValidate) {
    const [isValid, msg] = results[fmt];
    const status = isValid ? '✓' : '✗';
    console.log(`  [${status}] ${fmt.toUpperCase().padEnd(8)} - ${msg}`);
  }

  console.log('-'.repeat(50));

  if (allPassed) {
    console.log('All validations passed! ✓');
    return 0;
  } else {
    console.log('Some validations failed! ✗');
    return 1;
  }
}
