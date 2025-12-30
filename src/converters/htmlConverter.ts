/**
 * HTML format converter for data.yaml.
 * Ported from scripts/converters/html_converter.py
 */

import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import Handlebars from 'handlebars';
import type { DataYaml } from '../types/index.js';
import { countTotalTerms } from '../common/loadDataYaml.js';

/**
 * Convert data.yaml to HTML format and write to output_path.
 *
 * @param data - Parsed data.yaml dictionary
 * @param outputPath - Full path to output HTML file
 */
export function convertToHtml(data: DataYaml, outputPath: string): void {
  const outputFile = resolve(outputPath);
  mkdirSync(dirname(outputFile), { recursive: true });

  // Get the template directory - we need to read from source
  const templatePath = resolve(dirname(new URL(import.meta.url).pathname), '../templates/html/terms.hbs');

  // Read the template
  const templateContent = readFileSync(templatePath, 'utf-8');
  const template = Handlebars.compile(templateContent);

  // Sort terms by letter for consistent output
  const sortedTerms = Object.fromEntries(
    Object.entries(data.terms).sort(([a], [b]) => a.localeCompare(b))
  );
  const sortedFootnotes = Object.fromEntries(
    Object.entries(data.footnotes).sort(([a], [b]) => parseInt(a, 10) - parseInt(b, 10))
  );

  const rendered = template({
    terms: sortedTerms,
    footnotes: sortedFootnotes
  });

  writeFileSync(outputFile, rendered, 'utf-8');

  console.log(`  HTML: ${countTotalTerms(data)} terms written to ${outputPath}`);
}
