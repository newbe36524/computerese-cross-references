# term-data Spec Delta

## MODIFIED Requirements

### Requirement: Term Data Storage

The system SHALL store term data in a `data.yaml` file at the project root, using a custom YAML parser implemented in TypeScript.

#### Scenario: Data file exists at project root

- **GIVEN** the repository root directory
- **THEN** a `data.yaml` file SHALL exist containing all term data
- **AND** the file SHALL be parseable by the TypeScript YAML loader

#### Scenario: Data structure follows defined schema

- **GIVEN** the `data.yaml` file exists
- **WHEN** loaded by the TypeScript loader
- **THEN** the data SHALL conform to the TypeScript interface:
  ```typescript
  interface DataYaml {
    terms: Record<string, Term[]>;
    footnotes: Record<number, string>;
  }

  interface Term {
    word: string;
    meaning: string;
    footnotes?: number[];
  }
  ```
- **AND** `terms` SHALL contain keys A-Z
- **AND** each letter key SHALL map to an array of term objects

### Requirement: Data Completeness

The system SHALL ensure the `data.yaml` file contains complete and valid term data, validated by TypeScript scripts.

#### Scenario: Term count matches source

- **GIVEN** a `data.yaml` file exists
- **WHEN** `npm run validate:data-yaml` is executed
- **THEN** the validator SHALL count terms in `data.yaml`
- **AND** compare against terms extracted from README.md
- **AND** report any discrepancy

#### Scenario: All footnotes preserved

- **GIVEN** terms contain footnote references
- **WHEN** `data.yaml` is loaded
- **THEN** all footnote numbers SHALL be defined in the footnotes section
- **AND** no orphaned references SHALL exist

### Requirement: YAML Parseability

The system SHALL ensure `data.yaml` is parseable by the TypeScript YAML loader.

#### Scenario: Valid YAML syntax

- **GIVEN** a `data.yaml` file exists
- **WHEN** loaded by the TypeScript loader
- **THEN** the file SHALL parse without errors
- **AND** produce a valid data structure

## ADDED Requirements

### Requirement: TypeScript Data Loading

The system SHALL provide a TypeScript function for loading and parsing `data.yaml` with proper type safety.

#### Scenario: Load data.yaml with type safety

- **GIVEN** a valid `data.yaml` file exists
- **WHEN** `loadDataYaml(path)` is called
- **THEN** the function SHALL return a `DataYaml` object
- **AND** TypeScript SHALL enforce type checking on the returned value
- **AND** the function SHALL throw descriptive errors for missing or malformed files

#### Scenario: Handle YAML parsing errors

- **GIVEN** a malformed `data.yaml` file exists
- **WHEN** `loadDataYaml(path)` is called
- **THEN** the function SHALL throw a `YamlParseError`
- **AND** the error message SHALL indicate the line and nature of the parse failure

### Requirement: README.md to Data.yaml Parsing

The system SHALL provide a TypeScript script to parse `README.md` and generate `data.yaml`, replacing the Python version.

#### Scenario: Parse README and generate data.yaml

- **GIVEN** a `README.md` file exists with term tables
- **WHEN** `npm run parse:readme` is executed
- **THEN** the script SHALL extract terms from A-Z tables
- **AND** parse footnote references (`<sup>n</sup>`)
- **AND** extract footnote definitions
- **AND** generate a valid `data.yaml` file

#### Scenario: Handle missing README sections

- **GIVEN** a `README.md` with incomplete letter sections
- **WHEN** `npm run parse:readme` is executed
- **THEN** the script SHALL generate `data.yaml` with available data
- **AND** log a warning for missing letter groups

### Requirement: Data.yaml Validation

The system SHALL provide TypeScript scripts to validate `data.yaml` integrity.

#### Scenario: Validate YAML format

- **GIVEN** a `data.yaml` file exists
- **WHEN** `npm run validate:data-yaml` is executed
- **THEN** the validator SHALL check YAML syntax
- **AND** verify required top-level keys (`terms`, `footnotes`)
- **AND** report any format errors

#### Scenario: Validate footnote integrity

- **GIVEN** a `data.yaml` file with terms
- **WHEN** `npm run validate:data-yaml` is executed
- **THEN** the validator SHALL check all footnote references
- **AND** ensure each referenced number exists in footnotes section
- **AND** report any undefined footnote references

#### Scenario: Validate required fields

- **GIVEN** a `data.yaml` file with terms
- **WHEN** `npm run validate:data-yaml` is executed
- **THEN** the validator SHALL verify each term has `word` and `meaning` fields
- **AND** report any terms missing required fields

#### Scenario: Validate letter group completeness

- **GIVEN** a `data.yaml` file
- **WHEN** `npm run validate:data-yaml` is executed
- **THEN** the validator SHALL verify all letters A-Z are present
- **AND** report any missing or extra letter groups

## REMOVED Requirements

### Requirement: Python YAML Parsing

**Reason**: Migrating to TypeScript-based YAML parsing.

**Migration**: The `scripts/parse_readme.py` script is replaced by `src/commands/parseReadme.ts`. The `scripts/converters/common.py` YAML parsing logic is replaced by `src/common/loadDataYaml.ts`.

### Requirement: Python Validation Scripts

**Reason**: Migrating to TypeScript validation.

**Migration**: The `scripts/validate_data_yaml.py` script is replaced by `src/commands/validateDataYaml.ts`. All validation functions are reimplemented in TypeScript with equivalent functionality.
