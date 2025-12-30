# Data Conversion Specification Delta

## ADDED Requirements

### Requirement: Multi-Format Conversion Support

The system SHALL provide the ability to convert `data.yaml` into multiple output formats including Markdown, HTML, Word (.docx), CSV, and PDF.

#### Scenario: Convert to Markdown format

- **GIVEN** a valid `data.yaml` file exists at the project root
- **WHEN** the conversion script is executed with `--format markdown`
- **THEN** a Markdown file SHALL be generated at `dist/markdown/terms.md`
- **AND** the Markdown file SHALL contain all terms organized by letter groups
- **AND** each term SHALL be presented as `| English Word | Chinese Meaning |` table row
- **AND** footnote references SHALL be preserved as `<sup>n</sup>` markers

#### Scenario: Convert to HTML format

- **GIVEN** a valid `data.yaml` file exists at the project root
- **WHEN** the conversion script is executed with `--format html`
- **THEN** an HTML file SHALL be generated at `dist/html/terms.html`
- **AND** the HTML file SHALL include CSS styling for readability
- **AND** the HTML SHALL be structured with semantic HTML elements (headers, tables, sections)
- **AND** all terms and footnotes SHALL be preserved and rendered correctly

#### Scenario: Convert to Word format

- **GIVEN** a valid `data.yaml` file exists at the project root
- **WHEN** the conversion script is executed with `--format docx`
- **THEN** a Word document SHALL be generated at `dist/docx/terms.docx`
- **AND** the document SHALL contain all terms organized by letter groups
- **AND** each letter group SHALL have a section heading
- **AND** terms SHALL be presented in table format with columns for English word and Chinese meaning

#### Scenario: Convert to CSV format

- **GIVEN** a valid `data.yaml` file exists at the project root
- **WHEN** the conversion script is executed with `--format csv`
- **THEN** a CSV file SHALL be generated at `dist/csv/terms.csv`
- **AND** the CSV SHALL contain three columns: `letter`, `word`, `meaning`
- **AND** each term SHALL be represented as one row
- **AND** the `letter` column SHALL indicate the alphabetical group for each term

#### Scenario: Convert to PDF format

- **GIVEN** a valid `data.yaml` file exists at the project root
- **WHEN** the conversion script is executed with `--format pdf`
- **THEN** a PDF file SHALL be generated at `dist/pdf/terms.pdf`
- **AND** the PDF SHALL be formatted for printing with proper page margins
- **AND** all terms SHALL be organized by letter groups with clear section headers
- **AND** the document SHALL include a table of contents for navigation

### Requirement: Unified Conversion CLI Interface

The system SHALL provide a unified command-line interface for converting `data.yaml` to multiple formats.

#### Scenario: Single format conversion

- **GIVEN** the conversion script `scripts/convert_data.py` exists
- **WHEN** executed with `--format <format>` argument
- **THEN** only the specified format SHALL be generated
- **AND** the output file SHALL be created in the corresponding `dist/` subdirectory

#### Scenario: Multiple format conversion

- **GIVEN** the conversion script `scripts/convert_data.py` exists
- **WHEN** executed with `--format markdown,html,pdf` (comma-separated list)
- **THEN** all specified formats SHALL be generated
- **AND** each format SHALL be output to its corresponding subdirectory

#### Scenario: Custom output directory

- **GIVEN** the conversion script `scripts/convert_data.py` exists
- **WHEN** executed with `--output <path>` argument
- **THEN** output files SHALL be generated in the specified directory instead of default `dist/`

#### Scenario: Display help and available formats

- **GIVEN** the conversion script `scripts/convert_data.py` exists
- **WHEN** executed with `--help` argument
- **THEN** the script SHALL display usage instructions
- **AND** list all available output formats
- **AND** show examples of common commands

### Requirement: Output Directory Organization

Generated files SHALL be organized in a structured `dist/` directory with format-specific subdirectories.

#### Scenario: Default dist directory structure

- **GIVEN** the conversion script is executed without `--output` argument
- **WHEN** any format conversion is performed
- **THEN** a `dist/` directory SHALL be created at the project root
- **AND** format-specific subdirectories SHALL be created (e.g., `dist/markdown/`, `dist/html/`, etc.)

#### Scenario: Subdirectories created on-demand

- **GIVEN** the `dist/` directory exists
- **WHEN** converting to HTML format
- **THEN** `dist/html/` subdirectory SHALL be created if it does not exist
- **AND** the HTML file SHALL be placed in that subdirectory

### Requirement: Data Integrity Preservation

All conversions SHALL preserve the complete data integrity of the source `data.yaml` file.

#### Scenario: Term count validation

- **GIVEN** `data.yaml` contains N terms
- **WHEN** converting to any format
- **THEN** the generated file SHALL contain exactly N terms
- **AND** no terms SHALL be lost or duplicated

#### Scenario: Footnote preservation

- **GIVEN** a term in `data.yaml` has `footnotes: [4]`
- **WHEN** converting to Markdown or HTML format
- **THEN** the term SHALL include a footnote marker `<sup>4</sup>` in the output
- **AND** the footnote definition SHALL be included at the end of the document

#### Scenario: Character encoding preservation

- **GIVEN** `data.yaml` contains Chinese characters and special symbols
- **WHEN** converting to any format
- **THEN** all characters SHALL be correctly rendered in the output
- **AND** the output file SHALL use UTF-8 encoding (for text-based formats)

### Requirement: Template-Based Generation

Markdown and HTML formats SHALL use Jinja2 templates for customizable styling and structure.

#### Scenario: Markdown template rendering

- **GIVEN** a Jinja2 template exists at `scripts/templates/markdown/terms.j2`
- **WHEN** converting to Markdown format
- **THEN** the template SHALL be rendered with `data.yaml` content as context
- **AND** the output SHALL follow the template structure

#### Scenario: HTML template with CSS

- **GIVEN** a Jinja2 template exists at `scripts/templates/html/terms.j2`
- **WHEN** converting to HTML format
- **THEN** the template SHALL be rendered with embedded CSS styling
- **AND** the output SHALL be a standalone HTML file with no external dependencies
