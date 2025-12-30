/**
 * TypeScript type definitions for computerese-cross-references project.
 */

/**
 * A single term entry with word, meaning, and optional footnotes.
 */
export interface Term {
  /** The English word/phrase */
  word: string;
  /** The Chinese meaning/translation */
  meaning: string;
  /** Optional array of footnote reference numbers */
  footnotes?: number[];
}

/**
 * A letter group containing terms starting with that letter.
 */
export type LetterGroup = Term[];

/**
 * Mapping of letters A-Z to their term groups.
 */
export type TermsByLetter = Record<string, LetterGroup>;

/**
 * Mapping of footnote numbers to footnote text.
 */
export type Footnotes = Record<number, string>;

/**
 * The complete data structure from data.yaml.
 */
export interface DataYaml {
  /** Terms grouped by letter A-Z */
  terms: TermsByLetter;
  /** Footnote definitions keyed by number */
  footnotes: Footnotes;
}

/**
 * Validation result tuple with boolean and message.
 */
export type ValidationResult = [boolean, string];

/**
 * Format converter function type.
 */
export type ConverterFunction = (data: DataYaml, outputPath: string) => Promise<void> | void;
