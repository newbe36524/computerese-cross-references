# term-data Specification

## Purpose
TBD - created by archiving change data-yaml-term-extraction. Update Purpose after archive.
## Requirements
### Requirement: Term Data Storage

The system SHALL provide a structured YAML data file (`data.yaml`) that stores all computer terminology entries from the repository in a machine-readable format.

#### Scenario: Data file exists at project root

- **GIVEN** the repository contains term data in `README.md`
- **WHEN** the extraction process is complete
- **THEN** a `data.yaml` file SHALL exist at the project root directory

#### Scenario: Data structure follows defined schema

- **GIVEN** the `data.yaml` file exists
- **WHEN** the file is parsed
- **THEN** it SHALL contain a `terms` object with A-Z keys
- **AND** each letter key SHALL map to an array of term entries
- **AND** each term entry SHALL contain `word` and `meaning` fields
- **AND** a term entry MAY contain a `footnotes` array for footnote references

### Requirement: Alphabetical Grouping

Term data SHALL be organized by alphabetical grouping (A-Z) matching the structure of the original `README.md`.

#### Scenario: Terms grouped by letter

- **GIVEN** the `data.yaml` file exists
- **WHEN** accessing `data.yaml`
- **THEN** the `terms` object SHALL contain keys for all letters A-Z
- **AND** each letter key SHALL map to an array of terms starting with or categorized under that letter

### Requirement: Footnote Reference Storage

The system SHALL separate footnote references within term meanings from the footnote definitions themselves.

#### Scenario: Footnote references stored as arrays

- **GIVEN** a term in `README.md` contains a footnote marker like `<sup>4</sup>`
- **WHEN** the term is extracted to `data.yaml`
- **THEN** the `meaning` field SHALL NOT contain the `<sup>` tag
- **AND** the term entry SHALL include a `footnotes` array containing the footnote numbers
- **EXAMPLE**: A term with `<sup>4</sup>` in README.md becomes `footnotes: [4]` in YAML

#### Scenario: Footnote definitions stored separately

- **GIVEN** the `README.md` contains footnote definitions like `[1]`, `[2]`, etc.
- **WHEN** the data is extracted to `data.yaml`
- **THEN** a top-level `footnotes` object SHALL exist
- **AND** each footnote SHALL be stored as `number: "content"` mapping
- **EXAMPLE**: `[1]: "重构列表，摘自《重构》一书。"` becomes `1: "重构列表，摘自《重构》一书。"`

### Requirement: Data Completeness

The extracted `data.yaml` file SHALL contain all terms and footnotes from the source `README.md` without loss or omission.

#### Scenario: Term count matches source

- **GIVEN** `README.md` contains N term entries across all letter sections
- **WHEN** `data.yaml` is generated
- **THEN** the total term count in `data.yaml` SHALL equal N

#### Scenario: All footnotes preserved

- **GIVEN** `README.md` defines footnotes [1] through [6]
- **WHEN** `data.yaml` is generated
- **THEN** the `footnotes` object SHALL contain entries for all defined footnotes
- **AND** all footnote references in terms SHALL point to existing footnote definitions

### Requirement: YAML Parseability

The `data.yaml` file SHALL be valid YAML that can be parsed by standard YAML libraries without errors.

#### Scenario: Valid YAML syntax

- **GIVEN** the `data.yaml` file exists
- **WHEN** parsed by a standard YAML library (e.g., PyYAML, yaml-js)
- **THEN** the parse SHALL succeed without syntax errors
- **AND** the parsed structure SHALL match the defined schema

