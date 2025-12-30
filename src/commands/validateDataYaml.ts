/**
 * Validate data.yaml file integrity and correctness.
 * Ported from scripts/validate_data_yaml.py
 *
 * 验证 data.yaml 文件的完整性和正确性
 *
 * 该脚本执行以下验证：
 * 1. YAML 格式正确性
 * 2. 术语数量与 README.md 一致
 * 3. 脚注引用完整性（引用的脚注编号在定义中存在）
 * 4. 每个术语包含必需字段（word, meaning）
 * 5. 字母分组完整性（A-Z 全部覆盖）
 */

import { readFileSync } from 'fs';
import type { DataYaml } from '../types/index.js';
import { loadDataYaml, countTotalTerms, validateYamlFormat, validateFootnoteIntegrity, validateRequiredFields, validateLetterGroups } from '../common/loadDataYaml.js';

/**
 * Count terms in README.md.
 *
 * @param readmePath - Path to README.md file
 * @returns Number of terms found
 */
function countTermsInReadme(readmePath: string): number {
  const content = readFileSync(readmePath, 'utf-8');

  // Count table rows (each | ... | ... | row in each letter section)
  let totalTerms = 0;

  for (const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')) {
    // Find letter heading - use regex to find position
    const letterPattern = new RegExp(`^## ${letter}\\s*`, 'm');
    const letterMatch = letterPattern.exec(content);

    if (!letterMatch) {
      continue;
    }

    // Find next letter heading or notes section
    const startPos = letterMatch.index + letterMatch[0].length;

    // Build pattern for next letters
    let nextLetterPattern: RegExp;
    if (letter < 'Z') {
      const nextLetter = String.fromCharCode(letter.charCodeAt(0) + 1);
      nextLetterPattern = new RegExp(`^## [${nextLetter}-Z]`, 'm');
    } else {
      nextLetterPattern = /^## \[/m; // Won't match for Z
    }

    const nextLetterMatch = nextLetterPattern.exec(content.slice(startPos));

    let endPos: number;
    if (nextLetterMatch) {
      endPos = startPos + nextLetterMatch.index;
    } else {
      // Check if we've reached the notes section
      const commentPattern = /^\n# 注释/m;
      const commentMatch = commentPattern.exec(content.slice(startPos));
      if (commentMatch) {
        endPos = startPos + commentMatch.index;
      } else {
        endPos = content.length;
      }
    }

    const letterContent = content.slice(startPos, endPos);

    // Count table rows (exclude header and separator)
    const tableRows = letterContent.match(/^\|.*\|.*\|$/gm) || [];
    // Subtract header and separator rows (2 rows)
    totalTerms += Math.max(0, tableRows.length - 2);
  }

  return totalTerms;
}

/**
 * Validate term count matches README.md.
 *
 * @param data - Parsed data.yaml dictionary
 * @param readmePath - Path to README.md file
 * @returns Tuple of [isValid, message]
 */
function validateTermCount(data: DataYaml, readmePath: string): [boolean, string] {
  const yamlCount = countTotalTerms(data);
  const readmeCount = countTermsInReadme(readmePath);

  if (yamlCount === readmeCount) {
    return [true, `Term count matches: ${yamlCount} terms`];
  } else {
    return [false, `Term count mismatch: YAML has ${yamlCount}, README has ${readmeCount}`];
  }
}

/**
 * Main entry point for validate-data-yaml command.
 *
 * @param readmePath - Path to README.md file
 * @param yamlPath - Path to data.yaml file
 * @returns Exit code (0 for success, 1 for failure)
 */
export function validateDataYaml(readmePath: string, yamlPath: string): number {
  console.log(`Validating ${yamlPath}...`);
  console.log();

  let allPassed = true;

  // 1. YAML format validation
  console.log('1. YAML Format Validation:');
  let data: DataYaml;

  try {
    data = loadDataYaml(yamlPath);
    const [valid, msg] = validateYamlFormat(data);
    console.log(`   [${valid ? '✓' : '✗'}] ${msg}`);
    if (!valid) {
      console.log('\nStopping validation due to format error.');
      return 1;
    }
  } catch (error) {
    console.log(`   [✗] ${error instanceof Error ? error.message : String(error)}`);
    console.log('\nStopping validation due to format error.');
    return 1;
  }

  // 2. Term count validation
  console.log('\n2. Term Count Validation:');
  const [valid2, msg2] = validateTermCount(data, readmePath);
  console.log(`   [${valid2 ? '✓' : '✗'}] ${msg2}`);
  if (!valid2) {
    allPassed = false;
  }

  // 3. Footnote integrity validation
  console.log('\n3. Footnote Integrity Validation:');
  const [valid3, msg3] = validateFootnoteIntegrity(data);
  console.log(`   [${valid3 ? '✓' : '✗'}] ${msg3}`);
  if (!valid3) {
    allPassed = false;
  }

  // 4. Required fields validation
  console.log('\n4. Required Fields Validation:');
  const [valid4, msg4] = validateRequiredFields(data);
  console.log(`   [${valid4 ? '✓' : '✗'}] ${msg4}`);
  if (!valid4) {
    allPassed = false;
  }

  // 5. Letter group completeness validation
  console.log('\n5. Letter Group Completeness Validation:');
  const [valid5, msg5] = validateLetterGroups(data);
  console.log(`   [${valid5 ? '✓' : '✗'}] ${msg5}`);
  if (!valid5) {
    allPassed = false;
  }

  console.log();
  if (allPassed) {
    console.log('='.repeat(50));
    console.log('All validations passed! ✓');
    console.log('='.repeat(50));
    return 0;
  } else {
    console.log('='.repeat(50));
    console.log('Some validations failed! ✗');
    console.log('='.repeat(50));
    return 1;
  }
}
