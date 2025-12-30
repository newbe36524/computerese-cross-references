/**
 * CSV format converter for data.yaml.
 * Ported from scripts/converters/csv_converter.py
 */

import { mkdirSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import type { DataYaml } from '../types/index.js';
import { countTotalTerms } from '../common/loadDataYaml.js';

/**
 * Convert data.yaml to CSV format and write to output_path.
 *
 * @param data - Parsed data.yaml dictionary
 * @param outputPath - Full path to output CSV file
 */
export function convertToCsv(data: DataYaml, outputPath: string): void {
  const outputFile = resolve(outputPath);
  mkdirSync(dirname(outputFile), { recursive: true });

  const lines: string[] = [];

  // Write header
  lines.push('letter,word,meaning,footnotes');

  // Write term rows
  for (const letter of Object.keys(data.terms).sort()) {
    for (const term of data.terms[letter]) {
      const footnotesStr = term.footnotes ? term.footnotes.join(',') : '';

      // Escape CSV values: wrap in quotes if they contain comma, quote, or newline
      const escapeCsv = (value: string): string => {
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      };

      lines.push([
        letter,
        escapeCsv(term.word),
        escapeCsv(term.meaning),
        escapeCsv(footnotesStr)
      ].join(','));
    }
  }

  writeFileSync(outputFile, lines.join('\n'), 'utf-8');

  console.log(`  CSV: ${countTotalTerms(data)} terms written to ${outputPath}`);
}
