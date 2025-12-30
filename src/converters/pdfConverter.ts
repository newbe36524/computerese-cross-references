/**
 * PDF format converter for data.yaml.
 * Ported from scripts/converters/pdf_converter.py
 *
 * This function reuses the HTML template and converts it to PDF using Puppeteer.
 */

import { mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import puppeteer from 'puppeteer';
import type { DataYaml } from '../types/index.js';
import { countTotalTerms } from '../common/loadDataYaml.js';
import type { Browser } from 'puppeteer';

/**
 * Generate HTML content for PDF conversion.
 *
 * @param data - Parsed data.yaml dictionary
 * @returns HTML content string
 */
async function generateHtmlContent(data: DataYaml): Promise<string> {
  const { readFileSync } = await import('fs');
  const { resolve: resolvePath } = await import('path');

  // Get the template directory
  const templateDir = resolvePath(dirname(new URL(import.meta.url).pathname), '../templates/html');
  const templatePath = resolvePath(templateDir, 'terms.hbs');

  // Read the template
  const Handlebars = (await import('handlebars')).default;
  const templateContent = readFileSync(templatePath, 'utf-8');
  const template = Handlebars.compile(templateContent);

  // Sort terms by letter for consistent output
  const sortedTerms = Object.fromEntries(
    Object.entries(data.terms).sort(([a], [b]) => a.localeCompare(b))
  );
  const sortedFootnotes = Object.fromEntries(
    Object.entries(data.footnotes).sort(([a], [b]) => parseInt(a, 10) - parseInt(b, 10))
  );

  return template({
    terms: sortedTerms,
    footnotes: sortedFootnotes
  });
}

/**
 * Convert data.yaml to PDF format and write to output_path.
 *
 * @param data - Parsed data.yaml dictionary
 * @param outputPath - Full path to output PDF file
 */
export async function convertToPdf(data: DataYaml, outputPath: string): Promise<void> {
  const outputFile = resolve(outputPath);
  mkdirSync(dirname(outputFile), { recursive: true });

  // Generate HTML content
  const htmlContent = await generateHtmlContent(data);

  // Launch Puppeteer and generate PDF
  let browser: Browser | null = null;
  try {
    // In CI environments (like GitHub Actions), we need to use --no-sandbox
    // Detect CI by checking common CI environment variables
    const isCI = process.env.CI === 'true' ||
                 process.env.GITHUB_ACTIONS === 'true' ||
                 process.env.CI_NAME !== undefined;

    browser = await puppeteer.launch({
      headless: true,
      args: isCI ? ['--no-sandbox', '--disable-setuid-sandbox'] : []
    });

    const page = await browser.newPage();

    // Set the HTML content
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0'
    });

    // Generate PDF
    await page.pdf({
      path: outputFile,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '1in',
        right: '1in',
        bottom: '1in',
        left: '1in'
      }
    });

    console.log(`  PDF: ${countTotalTerms(data)} terms written to ${outputPath}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
