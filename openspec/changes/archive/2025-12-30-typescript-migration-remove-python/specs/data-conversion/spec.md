# data-conversion Spec Delta

## MODIFIED Requirements

### Requirement: Multi-Format Conversion Support

The system SHALL provide the ability to convert `data.yaml` into multiple output formats including Markdown, HTML, Word (.docx), CSV, and PDF using TypeScript/Node.js scripts.

#### Scenario: Convert to Markdown format

- **GIVEN** a valid `data.yaml` file exists at the project root
- **WHEN** the conversion script is executed with `npm run convert -- --format markdown`
- **THEN** a Markdown file SHALL be generated at `dist/markdown/terms.md`
- **AND** the Markdown file SHALL contain all terms organized by letter groups
- **AND** each term SHALL be presented as `| English Word | Chinese Meaning |` table row
- **AND** footnote references SHALL be preserved as `<sup>n</sup>` markers

#### Scenario: Convert to HTML format

- **GIVEN** a valid `data.yaml` file exists at the project root
- **WHEN** the conversion script is executed with `npm run convert -- --format html`
- **THEN** an HTML file SHALL be generated at `dist/html/terms.html`
- **AND** the HTML file SHALL include CSS styling for readability
- **AND** the HTML SHALL be structured with semantic HTML elements (headers, tables, sections)
- **AND** all terms and footnotes SHALL be preserved and rendered correctly

#### Scenario: Convert to Word format

- **GIVEN** a valid `data.yaml` file exists at the project root
- **WHEN** the conversion script is executed with `npm run convert -- --format docx`
- **THEN** a Word document SHALL be generated at `dist/docx/terms.docx`
- **AND** the document SHALL contain all terms organized by letter groups
- **AND** each letter group SHALL have a section heading
- **AND** terms SHALL be presented in table format with columns for English word and Chinese meaning

#### Scenario: Convert to CSV format

- **GIVEN** a valid `data.yaml` file exists at the project root
- **WHEN** the conversion script is executed with `npm run convert -- --format csv`
- **THEN** a CSV file SHALL be generated at `dist/csv/terms.csv`
- **AND** the CSV SHALL contain three columns: `letter`, `word`, `meaning`
- **AND** each term SHALL be represented as one row
- **AND** the `letter` column SHALL indicate the alphabetical group for each term

#### Scenario: Convert to PDF format

- **GIVEN** a valid `data.yaml` file exists at the project root
- **WHEN** the conversion script is executed with `npm run convert -- --format pdf`
- **THEN** a PDF file SHALL be generated at `dist/pdf/terms.pdf`
- **AND** the PDF SHALL be formatted for printing with proper page margins
- **AND** all terms SHALL be organized by letter groups with clear section headers
- **AND** the document SHALL include a table of contents for navigation

### Requirement: Unified Conversion CLI Interface

The system SHALL provide a unified command-line interface for converting `data.yaml` to multiple formats using Node.js/npm scripts.

#### Scenario: Single format conversion

- **GIVEN** the conversion script is available as `npm run convert`
- **WHEN** executed with `-- --format <format>` argument
- **THEN** only the specified format SHALL be generated
- **AND** the output file SHALL be created in the corresponding `dist/` subdirectory

#### Scenario: Multiple format conversion

- **GIVEN** the conversion script is available as `npm run convert`
- **WHEN** executed with `-- --format markdown html pdf` (space-separated list)
- **THEN** all specified formats SHALL be generated
- **AND** each format SHALL be output to its corresponding subdirectory

#### Scenario: Custom output directory

- **GIVEN** the conversion script is available as `npm run convert`
- **WHEN** executed with `-- --output <path>` argument
- **THEN** output files SHALL be generated in the specified directory instead of default `dist/`

#### Scenario: Display help and available formats

- **GIVEN** the conversion script is available as `npm run convert`
- **WHEN** executed with `-- --help` argument
- **THEN** the script SHALL display usage instructions
- **AND** list all available output formats
- **AND** show examples of common commands

## ADDED Requirements

### Requirement: TypeScript-Based Template Rendering

The system SHALL use Handlebars templates for Markdown and HTML format generation instead of Jinja2 templates.

#### Scenario: Markdown template rendering

- **GIVEN** a Handlebars template exists at `src/templates/markdown/terms.hbs`
- **WHEN** converting to Markdown format
- **THEN** the template SHALL be rendered with `data.yaml` content as context
- **AND** the output SHALL follow the template structure

#### Scenario: HTML template with CSS

- **GIVEN** a Handlebars template exists at `src/templates/html/terms.hbs`
- **WHEN** converting to HTML format
- **THEN** the template SHALL be rendered with embedded CSS styling
- **AND** the output SHALL be a standalone HTML file with no external dependencies

### Requirement: Node.js Runtime Dependency

The system SHALL require Node.js (v18 or higher) to execute all scripts instead of Python.

#### Scenario: Verify Node.js installation

- **GIVEN** a user wants to run conversion or validation scripts
- **WHEN** executing `npm run <command>`
- **THEN** the system SHALL check for Node.js availability
- **AND** display an error if Node.js is not installed or version is too old

### Requirement: Package.json-Based Script Distribution

The system SHALL use `package.json` for dependency management and script execution instead of `requirements.txt`.

#### Scenario: Install dependencies

- **GIVEN** a user clones the repository
- **WHEN** executing `npm install`
- **THEN** all required dependencies SHALL be installed to `node_modules/`
- **AND** the project SHALL be ready to run scripts

#### Scenario: Run conversion script

- **GIVEN** dependencies are installed via `npm install`
- **WHEN** executing `npm run convert`
- **THEN** the TypeScript CLI SHALL be executed
- **AND** conversion shall proceed

### Requirement: TypeScript Build Process

The system SHALL require TypeScript compilation before scripts can be executed.

#### Scenario: Build TypeScript source

- **GIVEN** TypeScript source files exist in `src/`
- **WHEN** executing `npm run build`
- **THEN** TypeScript SHALL be compiled to JavaScript
- **AND** output SHALL be placed in `dist/` directory
- **AND** executable scripts SHALL be generated

#### Scenario: Development mode with watch

- **GIVEN** a developer is actively modifying TypeScript source
- **WHEN** executing `npm run build:watch`
- **THEN** TypeScript SHALL be recompiled on file changes
- **AND** compilation errors SHALL be displayed immediately

## REMOVED Requirements

### Requirement: Python Runtime Dependency

**Reason**: Migrating to TypeScript/Node.js eliminates Python dependency.

**Migration**: Users must install Node.js v18+ instead of Python. All script invocations change from `python scripts/*.py` to `npm run <command>`.

### Requirement: requirements.txt Dependency Management

**Reason**: npm and `package.json` replace Python's `requirements.txt`.

**Migration**: Dependencies are now managed through `package.json`. Users run `npm install` instead of `pip install -r requirements.txt`.

### Requirement: Jinja2 Template-Based Generation

**Reason**: Jinja2 is Python-specific. Migrating to Handlebars for TypeScript compatibility.

**Migration**: Template syntax changes from Jinja2 (`{% for %}`, `{{ var }}`) to Handlebars (`{{#each}}`, `{{var}}`). Functionality remains equivalent.
