# Proposal: data-yaml-multi-format-converter

## Summary

Create a multi-format conversion script system to transform `data.yaml` into various output formats (Markdown, HTML, Word, CSV, PDF) for different user scenarios and distribution channels.

## Why

The current `data.yaml` file serves only as an intermediate data storage format, lacking multiple presentation formats for end users:

- **Limited Format Access**: Users can only access raw YAML data, lacking user-friendly reading interfaces
- **Restricted Distribution**: Cannot directly generate document formats for different scenarios (PDF for printing, HTML for web browsing, Word for editing)
- **Missing Automation**: Lacks the ability to integrate data conversion into CI/CD workflows for automatic build and release

Users need the flexibility to consume terminology data in formats that best suit their workflows—whether for printing (PDF), editing (Word), analysis (CSV), or online browsing (HTML).

## What Changes

This proposal adds a new multi-format conversion capability to the project:

1. **New conversion scripts** in `scripts/converters/` for each output format (CSV, Markdown, HTML, Word, PDF)
2. **New CLI entry point** `scripts/convert_data.py` for unified format conversion
3. **New Jinja2 templates** in `scripts/templates/` for customizable Markdown and HTML output
4. **New Python virtual environment** with dependencies managed in `requirements.txt`
5. **New validation script** `scripts/validate_conversions.py` for data integrity verification
6. **New documentation** for conversion usage and setup

## Background

The project currently maintains a structured terminology data store (`data.yaml`) containing hundreds of computer terminology English-Chinese translation pairs. The data structure uses YAML format, organized by letters A-Z, with each term entry containing:
- `word`: English term
- `meaning`: Chinese translation
- `footnotes` (optional): Footnote reference numbers

The existing script ecosystem includes:
- `parse_readme.py`: Extracts terms from README.md to generate data.yaml
- `validate_data_yaml.py`: Validates data integrity

The project has established the capability to convert from Markdown tables to structured data.

## Scope

### In Scope
- Conversion script supporting Markdown, HTML, Word, CSV, and PDF formats
- CLI interface for format selection and output path configuration
- Preservation of term data structure (alphabetical grouping, footnotes)
- Templates for styled output (HTML, Markdown)
- Documentation for usage and extension

### Out of Scope
- Web server or hosting infrastructure
- Real-time data synchronization
- Interactive UI for format selection
- Custom styling beyond default templates

## Impact

- **User Experience**: Users can choose appropriate document formats based on their needs
- **Automation**: Enables future CI/CD auto-build steps; generated files can be automatically packaged to GitHub Releases
- **Extensibility**: Provides foundation for future web interfaces or API endpoints
- **Maintainability**: Single data source (`data.yaml`) drives multiple output formats, ensuring data consistency

## Alternatives Considered

1. **External Documentation Tools**: Using tools like Sphinx or MkDocs
   - *Rejected*: Adds unnecessary complexity for the project's simple data structure

2. **Online Conversion Services**: Using web-based APIs
   - *Rejected*: Adds external dependencies and privacy concerns for data processing

3. **Manual Export**: Editing output formats by hand
   - *Rejected*: Unsustainable, error-prone, and defeats the purpose of structured data

## Success Criteria

- All five output formats (Markdown, HTML, Word, CSV, PDF) can be generated from `data.yaml`
- Generated files preserve all term data including footnotes
- CLI script supports selective format generation (e.g., `--format markdown,html`)
- Generated HTML includes basic styling for readability
- PDF generation produces a printable document with proper formatting
- All conversions pass validation against source data integrity
- Virtual environment is documented and can be set up with a single command
- All dependencies are pinned in `requirements.txt` for reproducibility

## Dependencies

### Python Libraries
- `yaml`: Already in use for data.yaml parsing
- `jinja2`: For template-based generation (Markdown, HTML)
- `python-docx`: For Word document generation
- `weasyprint` or `pdfkit`: For PDF generation

### Infrastructure
- No infrastructure changes required
- Optional: GitHub Actions workflow for automatic conversion on data changes
