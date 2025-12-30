/**
 * Word (.docx) format converter for data.yaml.
 * Ported from scripts/converters/docx_converter.py
 */

import { mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, TextRun } from 'docx';
import type { DataYaml } from '../types/index.js';
import { countTotalTerms } from '../common/loadDataYaml.js';

/**
 * Convert data.yaml to Word (.docx) format and write to output_path.
 *
 * @param data - Parsed data.yaml dictionary
 * @param outputPath - Full path to output DOCX file
 */
export async function convertToDocx(data: DataYaml, outputPath: string): Promise<void> {
  const outputFile = resolve(outputPath);
  mkdirSync(dirname(outputFile), { recursive: true });

  const children: any[] = [];

  // Title
  children.push(
    new Paragraph({
      text: '计算机专业术语对照',
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    })
  );

  // Sort terms by letter
  const sortedTerms = Object.fromEntries(
    Object.entries(data.terms).sort(([a], [b]) => a.localeCompare(b))
  );

  // Process each letter group
  for (const letter of Object.keys(sortedTerms)) {
    // Letter heading
    children.push(
      new Paragraph({
        text: letter,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      })
    );

    // Create table for this letter
    const tableRows: TableRow[] = [];

    // Header row
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'English', bold: true })] })],
            width: { size: 45, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: 'Chinese', bold: true })] })],
            width: { size: 55, type: WidthType.PERCENTAGE }
          })
        ]
      })
    );

    // Add terms to table
    for (const term of sortedTerms[letter]) {
      // English word with footnotes
      let wordText = term.word;
      if (term.footnotes && term.footnotes.length > 0) {
        wordText += term.footnotes.map(n => `[${n}]`).join('');
      }

      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph(wordText)]
            }),
            new TableCell({
              children: [new Paragraph(term.meaning)]
            })
          ]
        })
      );
    }

    children.push(
      new Table({
        rows: tableRows,
        width: { size: 100, type: WidthType.PERCENTAGE }
      })
    );
  }

  // Add footnotes section if present
  if (Object.keys(data.footnotes).length > 0) {
    children.push(
      new Paragraph({
        text: '',
        spacing: { before: 400, after: 200 }
      })
    );

    children.push(
      new Paragraph({
        text: '脚注',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 200 }
      })
    );

    const sortedFootnotes = Object.fromEntries(
      Object.entries(data.footnotes).sort(([a], [b]) => parseInt(a, 10) - parseInt(b, 10))
    );

    for (const [num, text] of Object.entries(sortedFootnotes)) {
      children.push(
        new Paragraph({
          text: `[${num}] ${text}`,
          bullet: { level: 0 },
          spacing: { after: 150 }
        })
      );
    }
  }

  // Create document
  const doc = new Document({
    sections: [{
      properties: {},
      children: children
    }]
  });

  // Save document
  const buffer = await Packer.toBuffer(doc);
  const { writeFileSync } = await import('fs');
  writeFileSync(outputFile, buffer);

  console.log(`  DOCX: ${countTotalTerms(data)} terms written to ${outputPath}`);
}
