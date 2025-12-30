/**
 * Parse README.md to extract terms and generate data.yaml.
 * Ported from scripts/parse_readme.py
 *
 * 解析 README.md 中的术语表格，提取并生成 data.yaml 文件
 *
 * 该脚本执行以下操作：
 * 1. 解析 README.md 中 A-Z 分组的术语表格
 * 2. 提取每个术语的 word 和 meaning
 * 3. 解析脚注引用 (<sup>n</sup> 格式)
 * 4. 提取脚注定义 ([1]-[6] 格式)
 * 5. 生成结构化的 data.yaml 文件
 */

import { readFileSync, writeFileSync } from 'fs';
import type { DataYaml, Term } from '../types/index.js';

/**
 * Escape YAML string special characters.
 *
 * @param s - String to escape
 * @returns Escaped string
 */
function escapeYamlString(s: string): string {
  // If string contains special characters, wrap in quotes
  if (/["'[\]{},|*&#!%@"`]|:[\s]/.test(s)) {
    // For strings with single quotes, use double quotes and escape internal double quotes
    if (s.includes("'")) {
      return `"${s.replace(/"/g, '\\"')}"`;
    }
    // Otherwise use single quotes
    return `'${s}'`;
  }
  // If string is empty or starts with space, use quotes
  if (!s || s.startsWith(' ')) {
    return `"${s}"`;
  }
  return s;
}

/**
 * Parse README.md file to extract terms and footnotes data.
 *
 * @param readmePath - README.md file path
 * @returns Object containing terms and footnotes
 */
function parseReadmeFile(readmePath: string): DataYaml {
  const content = readFileSync(readmePath, 'utf-8');

  // Extract footnote definitions (format: [1] Footnote content)
  const footnotePattern = /\[(\d+)\]\s*(.+?)(?=\n\n|\n\[|$)/gs;
  const footnotes: Record<number, string> = {};

  let match;
  while ((match = footnotePattern.exec(content)) !== null) {
    const num = parseInt(match[1], 10);
    const text = match[2].trim();
    if (num <= 6) { // Only process footnotes 1-6
      footnotes[num] = text;
    }
  }

  // Parse terms tables
  const terms: Record<string, Term[]> = {};

  // Parse by letter groups
  for (const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')) {
    // Find the letter heading
    const letterPattern = new RegExp(`## ${letter}\\s*\\n`, 'y');
    const letterMatch = letterPattern.exec(content);

    if (!letterMatch) {
      continue;
    }

    // Start extracting table content from after the letter heading
    const startPos = letterMatch.index + letterMatch[0].length;

    // Find next letter heading or document end
    let nextLetterPattern: RegExp;
    if (letter < 'Z') {
      const nextLetter = String.fromCharCode(letter.charCodeAt(0) + 1);
      nextLetterPattern = new RegExp(`## [${nextLetter}-Z]`, 'y');
    } else {
      nextLetterPattern = /## \[/y; // Won't match for Z
    }

    nextLetterPattern.lastIndex = startPos;
    const nextLetterMatch = nextLetterPattern.exec(content);

    let endPos: number;
    if (nextLetterMatch) {
      endPos = nextLetterMatch.index;
    } else {
      // Check if we've reached the notes section
      const commentPattern = /\n# 注释/y;
      commentPattern.lastIndex = startPos;
      const commentMatch = commentPattern.exec(content);
      if (commentMatch) {
        endPos = commentMatch.index;
      } else {
        endPos = content.length;
      }
    }

    // Extract the letter section content
    const letterContent = content.slice(startPos, endPos);

    // Parse table rows (format: | Word | Meaning |)
    const tablePattern = /^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|$/gmy;
    const tableMatches = Array.from(letterContent.matchAll(tablePattern));

    if (tableMatches.length > 0) {
      const termsList: Term[] = [];

      // Skip header and separator rows (first two rows)
      // Separator row is identified by having lots of dashes
      for (let i = 0; i < tableMatches.length; i++) {
        // Skip first two rows (header and separator)
        if (i < 2) {
          continue;
        }

        let word = tableMatches[i][1]?.trim() || '';
        let meaning = tableMatches[i][2]?.trim() || '';

        if (!word || !meaning) {
          continue;
        }

        // Extract footnote references (<sup>n</sup> format)
        const footnoteRefs: number[] = [];
        const footnoteRefPattern = /<sup>(\d+)<\/sup>/g;
        let refMatch;
        while ((refMatch = footnoteRefPattern.exec(meaning)) !== null) {
          footnoteRefs.push(parseInt(refMatch[1], 10));
        }

        // Remove footnote markers, preserve spaces
        meaning = meaning.replace(footnoteRefPattern, '').trim();

        const termEntry: Term = {
          word: word,
          meaning: meaning
        };

        // Only add footnotes field if there are footnote references
        if (footnoteRefs.length > 0) {
          termEntry.footnotes = footnoteRefs;
        }

        termsList.push(termEntry);
      }

      if (termsList.length > 0) {
        terms[letter] = termsList;
      }
    }
  }

  return {
    terms: terms,
    footnotes: footnotes
  };
}

/**
 * Generate data.yaml file.
 *
 * @param data - Object containing terms and footnotes
 * @param outputPath - Output file path
 */
function generateYaml(data: DataYaml, outputPath: string): void {
  const lines: string[] = [];

  // File header comments
  lines.push('# 计算机专业术语对照数据');
  lines.push('#');
  lines.push('# 数据结构:');
  lines.push('#   terms:');
  lines.push('#     [A-Z]:                        # 按字母分组的术语列表');
  lines.push('#       - word: string              # 英文术语');
  lines.push('#         meaning: string           # 中文释义');
  lines.push('#         footnotes: [number]       # 脚注引用编号列表（可选）');
  lines.push('#   footnotes:');
  lines.push('#     [1-6]: string                 # 脚注定义内容');
  lines.push('#');
  lines.push('# 说明:');
  lines.push('#   - 术语按字母 A-Z 分组存储');
  lines.push('#   - footnotes 字段仅当术语有脚注引用时存在');
  lines.push('#   - 脚注编号 1-6 对应文档末尾的脚注定义');
  lines.push('');

  // Output terms section
  lines.push('terms:');

  for (const letter of Object.keys(data.terms).sort()) {
    const termsList = data.terms[letter];
    lines.push(`  ${letter}:`);

    for (const term of termsList) {
      lines.push(`    - word: ${escapeYamlString(term.word)}`);
      lines.push(`      meaning: ${escapeYamlString(term.meaning)}`);
      if (term.footnotes) {
        lines.push(`      footnotes: [${term.footnotes.join(', ')}]`);
      }
    }
  }

  lines.push('');

  // Output footnotes section
  lines.push('footnotes:');

  for (const num of Object.keys(data.footnotes).map(k => parseInt(k, 10)).sort((a, b) => a - b)) {
    const text = data.footnotes[num];
    lines.push(`  ${num}: ${escapeYamlString(text)}`);
  }

  writeFileSync(outputPath, lines.join('\n'), 'utf-8');
}

/**
 * Main entry point for parse-readme command.
 *
 * @param readmePath - Path to README.md file
 * @param outputPath - Path to output data.yaml file
 */
export function parseReadme(readmePath: string, outputPath: string): void {
  console.log(`Reading ${readmePath}...`);
  const data = parseReadmeFile(readmePath);

  // Count terms
  const totalTerms = Object.values(data.terms).reduce((sum, terms) => sum + terms.length, 0);
  console.log(`Extracted ${totalTerms} terms across ${Object.keys(data.terms).length} letter groups`);
  console.log(`Extracted ${Object.keys(data.footnotes).length} footnote definitions`);

  console.log(`Writing ${outputPath}...`);
  generateYaml(data, outputPath);

  console.log('Done!');
}
