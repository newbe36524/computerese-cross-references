# TypeScript Migration Tasks

## 1. Project Setup

- [x] 1.1 Initialize `package.json` with project metadata, scripts, and dependencies
- [x] 1.2 Create `tsconfig.json` with appropriate compiler options
- [x] 1.3 Update `.gitignore` for Node.js/TypeScript artifacts (node_modules/, dist/, *.tsbuildinfo)
- [ ] 1.4 Set up ESLint and Prettier configuration for TypeScript

## 2. Core Utilities

- [x] 2.1 Create TypeScript types for data structures (Term, Footnote, DataYaml)
- [x] 2.2 Port `scripts/converters/common.py` to TypeScript (`src/common/loadDataYaml.ts`)
- [x] 2.3 Implement YAML parsing utility (using `yaml` or `js-yaml` package)
- [ ] 2.4 Add unit tests for core utilities

## 3. CLI Entry Points

- [x] 3.1 Create main CLI entry point (`src/cli.ts`)
- [x] 3.2 Implement argument parsing (using `commander` or `yargs`)
- [x] 3.3 Add help text and usage examples
- [x] 3.4 Configure npm scripts in package.json

## 4. Data.yaml Parsing Script

- [x] 4.1 Port `scripts/parse_readme.py` to TypeScript (`src/commands/parseReadme.ts`)
- [x] 4.2 Implement README.md parsing logic
- [x] 4.3 Implement YAML generation logic
- [x] 4.4 Add CLI command: `npm run parse:readme`

## 5. Data.yaml Validation Script

- [x] 5.1 Port `scripts/validate_data_yaml.py` to TypeScript (`src/commands/validateDataYaml.ts`)
- [x] 5.2 Port all validation functions (format, term count, footnote integrity, required fields, letter groups)
- [x] 5.3 Add CLI command: `npm run validate:data-yaml`

## 6. Converters - CSV

- [x] 6.1 Port `scripts/converters/csv_converter.py` to TypeScript (`src/converters/csvConverter.ts`)
- [x] 6.2 Ensure UTF-8 encoding and proper CSV formatting

## 7. Converters - Markdown

- [x] 7.1 Port `scripts/converters/markdown_converter.py` to TypeScript
- [x] 7.2 Migrate Jinja2 template to TypeScript-compatible format (Handlebars, EJS, or simple template literals)
- [x] 7.3 Create template at `src/templates/markdown/terms.hbs` (or equivalent)
- [x] 7.4 Implement template rendering logic

## 8. Converters - HTML

- [x] 8.1 Port `scripts/converters/html_converter.py` to TypeScript (`src/converters/htmlConverter.ts`)
- [x] 8.2 Migrate Jinja2 template to TypeScript-compatible format
- [x] 8.3 Create template at `src/templates/html/terms.hbs` (or equivalent)
- [x] 8.4 Preserve embedded CSS styling

## 9. Converters - DOCX

- [x] 9.1 Port `scripts/converters/docx_converter.py` to TypeScript (`src/converters/docxConverter.ts`)
- [x] 9.2 Identify and configure TypeScript DOCX library (e.g., `docx` or `docxtemplater`)
- [x] 9.3 Implement table generation, formatting, and footnote handling

## 10. Converters - PDF

- [x] 10.1 Port `scripts/converters/pdf_converter.py` to TypeScript (`src/converters/pdfConverter.ts`)
- [x] 10.2 Identify and configure PDF generation library (e.g., `puppeteer`, `pdf-lib`, or HTML-to-PDF)
- [x] 10.3 Implement PDF generation from HTML template

## 11. Main Conversion Script

- [x] 11.1 Port `scripts/convert_data.py` to TypeScript (`src/commands/convertData.ts`)
- [x] 11.2 Implement lazy-loading of converters
- [x] 11.3 Add CLI command: `npm run convert [options]`

## 12. Conversion Validation Script

- [x] 12.1 Port `scripts/validate_conversions.py` to TypeScript (`src/commands/validateConversions.ts`)
- [x] 12.2 Port CSV validation logic
- [x] 12.3 Port file existence validation
- [x] 12.4 Add CLI command: `npm run validate:conversions`

## 13. Build and Distribution

- [x] 13.1 Configure build process (tsc + bundle if needed)
- [x] 13.2 Add `npm run build` script
- [x] 13.3 Set up executable shebang handling for CLI scripts

## 14. Documentation

- [ ] 14.1 Update README.md with TypeScript/Node.js usage instructions
- [x] 14.2 Update `openspec/specs/data-conversion/spec.md` scenarios to reference npm commands
- [x] 14.3 Update `openspec/specs/term-data/spec.md` scenarios to reference npm commands
- [ ] 14.4 Add CONTRIBUTING.md for TypeScript development workflow

## 15. Cleanup

- [ ] 15.1 Verify all TypeScript scripts produce identical output to Python versions
- [x] 15.2 Remove all Python scripts (*.py files)
- [x] 15.3 Remove `requirements.txt`
- [x] 15.4 Remove `scripts/templates/` (Jinja2 templates)
- [ ] 15.5 Update any CI/CD configurations for Node.js instead of Python

## 16. Testing

- [ ] 16.1 Run full conversion pipeline: `npm run convert`
- [ ] 16.2 Run all validation scripts: `npm run validate:*`
- [ ] 16.3 Compare output files with Python-generated versions
- [ ] 16.4 Test on all supported platforms (Linux, macOS, Windows)
