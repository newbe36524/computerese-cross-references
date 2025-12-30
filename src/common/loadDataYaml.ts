/**
 * Common data loading utilities for data.yaml converter.
 * Ported from scripts/converters/common.py
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import type { DataYaml, ValidationResult, Term } from '../types/index.js';

/**
 * Load and parse data.yaml file.
 *
 * @param yamlPath - Path to data.yaml file
 * @returns DataYaml with 'terms' and 'footnotes' keys.
 *          'terms' is a dict mapping letters A-Z to lists of term entries.
 *          Each term entry contains 'word', 'meaning', and optionally 'footnotes'.
 *          'footnotes' is a dict mapping footnote numbers to text.
 * @throws Error if yaml_path doesn't exist or YAML structure is invalid
 */
export function loadDataYaml(yamlPath: string): DataYaml {
  const path = resolve(yamlPath);

  try {
    const content = readFileSync(path, 'utf-8');

    const result: DataYaml = {
      terms: {},
      footnotes: {}
    };

    let currentSection: 'terms' | 'footnotes' | null = null;
    let currentLetter: string | null = null;
    let currentTerm: Term | null = null;

    for (const line of content.split('\n')) {
      // Skip comments and empty lines
      const stripped = line.trim();
      if (!stripped || stripped.startsWith('#')) {
        continue;
      }

      // Top-level sections: terms, footnotes
      if (stripped === 'terms:') {
        currentSection = 'terms';
        continue;
      } else if (stripped === 'footnotes:') {
        currentSection = 'footnotes';
        continue;
      }

      // Parse terms section
      if (currentSection === 'terms') {
        // Letter groups (A:, B:, etc.)
        const letterMatch = stripped.match(/^\s*([A-Z]):\s*$/);
        if (letterMatch) {
          currentLetter = letterMatch[1];
          if (!(currentLetter in result.terms)) {
            result.terms[currentLetter] = [];
          }
          currentTerm = null;
          continue;
        }

        // Term entries (- word: ...)
        if (stripped.startsWith('- word:')) {
          const wordValue = stripped.split(':', 2)[1].trim().replace(/^["']|["']$/g, '');
          currentTerm = { word: wordValue, meaning: '' };
          continue;
        }

        // meaning or footnotes
        if (currentTerm) {
          if (stripped.startsWith('meaning:')) {
            const meaningValue = stripped.split(':', 2)[1].trim().replace(/^["']|["']$/g, '');
            currentTerm.meaning = meaningValue;
            // Only push term after meaning is set
            if (currentLetter) {
              result.terms[currentLetter].push(currentTerm);
              currentTerm = null;
            }
          } else if (stripped.startsWith('footnotes:')) {
            // Parse array format [1, 2]
            const footnotesStr = stripped.split(':', 2)[1].trim();
            const footnotesMatch = footnotesStr.match(/^\[(.*?)\]$/);
            if (footnotesMatch) {
              const footnotesList = footnotesMatch[1]
                .split(',')
                .map(x => parseInt(x.trim(), 10))
                .filter(x => !isNaN(x));
              currentTerm.footnotes = footnotesList;
            }
          }
        }
      }

      // Parse footnotes section
      else if (currentSection === 'footnotes') {
        // Format: 1: "content"
        const footnoteMatch = stripped.match(/^\s*(\d+):\s*(.+)$/);
        if (footnoteMatch) {
          const num = parseInt(footnoteMatch[1], 10);
          const text = footnoteMatch[2].trim().replace(/^["']|["']$/g, '');
          result.footnotes[num] = text;
        }
      }
    }

    // Validate the parsed data
    if (!result.terms || Object.keys(result.terms).length === 0) {
      throw new Error("Invalid YAML structure: missing or empty 'terms' section");
    }

    return result;
  } catch (error) {
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`data.yaml file not found: ${yamlPath}`);
    }
    throw error;
  }
}

/**
 * Count the total number of terms across all letter groups.
 *
 * @param data - Parsed data.yaml dictionary
 * @returns Total number of terms
 */
export function countTotalTerms(data: DataYaml): number {
  return Object.values(data.terms).reduce((sum, terms) => sum + terms.length, 0);
}

/**
 * Validate YAML format.
 *
 * @param data - Parsed data.yaml dictionary
 * @returns Tuple of [isValid, message]
 */
export function validateYamlFormat(data: DataYaml): ValidationResult {
  if (!data.terms) {
    return [false, "Missing 'terms' key"];
  }
  if (!data.footnotes) {
    return [false, "Missing 'footnotes' key"];
  }
  return [true, "YAML format is valid"];
}

/**
 * Validate footnote integrity - ensure all references have definitions.
 *
 * @param data - Parsed data.yaml dictionary
 * @returns Tuple of [isValid, message]
 */
export function validateFootnoteIntegrity(data: DataYaml): ValidationResult {
  const validFootnoteNumbers = new Set(Object.keys(data.footnotes).map(k => parseInt(k, 10)));
  const issues: string[] = [];

  for (const terms of Object.values(data.terms)) {
    for (const term of terms) {
      if (term.footnotes) {
        for (const ref of term.footnotes) {
          if (!validFootnoteNumbers.has(ref)) {
            issues.push(`Term '${term.word}' references undefined footnote ${ref}`);
          }
        }
      }
    }
  }

  if (issues.length > 0) {
    return [false, issues.join('; ')];
  }
  return [true, 'All footnote references are valid'];
}

/**
 * Validate required fields for each term.
 *
 * @param data - Parsed data.yaml dictionary
 * @returns Tuple of [isValid, message]
 */
export function validateRequiredFields(data: DataYaml): ValidationResult {
  const issues: string[] = [];

  for (const [letter, terms] of Object.entries(data.terms)) {
    terms.forEach((term, i) => {
      if (!term.word) {
        issues.push(`${letter}[${i}]: missing 'word' field`);
      }
      if (!term.meaning) {
        issues.push(`${letter}[${i}]: missing 'meaning' field`);
      }
    });
  }

  if (issues.length > 0) {
    return [false, issues.join('; ')];
  }
  return [true, 'All terms have required fields'];
}

/**
 * Validate letter group completeness (A-Z).
 *
 * @param data - Parsed data.yaml dictionary
 * @returns Tuple of [isValid, message]
 */
export function validateLetterGroups(data: DataYaml): ValidationResult {
  const expectedLetters = new Set('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
  const actualLetters = new Set(Object.keys(data.terms));

  const missing = [...expectedLetters].filter(x => !actualLetters.has(x));
  const extra = [...actualLetters].filter(x => !expectedLetters.has(x));

  if (missing.length > 0) {
    return [false, `Missing letter groups: ${missing.sort().join(', ')}`];
  }
  if (extra.length > 0) {
    return [false, `Extra letter groups: ${extra.sort().join(', ')}`];
  }

  return [true, 'All A-Z letter groups present'];
}
