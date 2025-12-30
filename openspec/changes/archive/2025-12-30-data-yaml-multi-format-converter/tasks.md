# Implementation Tasks

## Overview

This document outlines the implementation tasks for the multi-format data.yaml converter feature. Tasks are ordered by dependency, with items that can be done in parallel marked accordingly.

## Status: ExecutionCompleted

All 13 core tasks have been completed. Task 14 (GitHub Actions) is optional and out of scope.

---

## Phase 1: Foundation and Core Structure

### - [x] 1. Create project directory structure

**Description**: Set up the directory structure for templates, output files, and conversion modules.

**Actions**:
- Create `scripts/converters/` directory for format-specific converter modules
- Create `scripts/templates/` directory for Jinja2 templates
- Create `scripts/templates/markdown/` subdirectory
- Create `scripts/templates/html/` subdirectory
- Add `.gitignore` entry for `dist/` directory
- Add `.gitignore` entry for `venv/` directory (Python virtual environment)

**Validation**: Directory structure exists and is empty/ready for content

**Dependencies**: None

---

### - [x] 2. Set up Python virtual environment

**Description**: Create a Python virtual environment to isolate and pin project dependencies.

**Actions**:
- Create `.venv/` directory using Python `venv` module
- Add activation script documentation to README (e.g., `source .venv/bin/activate` on Unix, `.venv\Scripts\activate` on Windows)
- Create initial `requirements.txt` with pinned versions:
  - `pyyaml>=6.0,<7.0` (for YAML parsing)
  - `jinja2>=3.1.0,<4.0.0` (for templates)
  - `python-docx>=1.0.0,<2.0.0` (for Word output)
  - `weasyprint>=60.0,<62.0` (for PDF output)
- Add comments in `requirements.txt` explaining which format requires each dependency
- Document installation steps: `python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt`

**Validation**: Virtual environment can be created and activated successfully; all dependencies install without errors

**Dependencies**: None (can be done in parallel with Task 1)

---

### - [x] 3. Create base YAML data loader module

**Description**: Extract and create a reusable module for loading and parsing `data.yaml`.

**Actions**:
- Create `scripts/converters/common.py` with `load_data_yaml()` function
- Reuse parsing logic from `validate_data_yaml.py` or use PyYAML library
- Implement error handling for missing or malformed YAML files
- Add type hints for the data structure

**Validation**: Unit test confirms the loader can parse `data.yaml` and return the expected dictionary structure

**Dependencies**: None (can be done in parallel with Tasks 1-2)

---

### - [x] 4. Implement CSV converter (simplest format)

**Description**: Create the CSV format converter as the first working output format.

**Actions**:
- Create `scripts/converters/csv_converter.py`
- Implement `convert_to_csv(data, output_path)` function
- Output CSV with columns: `letter`, `word`, `meaning`, `footnotes` (optional)
- Use Python's built-in `csv` module
- Handle UTF-8 encoding for Chinese characters

**Validation**: Running the converter produces `dist/csv/terms.csv` with correct term count and encoding

**Dependencies**: Task 3 (data loader)

---

## Phase 2: Template-Based Formats

### - [x] 5. Create Markdown template and converter

**Description**: Implement Markdown output using Jinja2 templates.

**Actions**:
- Create `scripts/templates/markdown/terms.j2` template with:
  - Document title and header
  - Table of contents for letter sections
  - Term tables grouped by letter
  - Footnotes section at the end
- Create `scripts/converters/markdown_converter.py`
- Implement `convert_to_markdown(data, output_path)` function using Jinja2
- Add footnote rendering as `<sup>n</sup>` markers

**Validation**: Generated Markdown file has valid syntax, all terms present, footnotes correctly rendered

**Dependencies**: Task 3 (can be done in parallel with Task 6)

---

### - [x] 6. Create HTML template and converter

**Description**: Implement HTML output with CSS styling using Jinja2 templates.

**Actions**:
- Create `scripts/templates/html/terms.j2` template with:
  - HTML5 document structure
  - Embedded CSS for styling (responsive tables, readable typography)
  - Semantic HTML elements (`<section>`, `<table>`, `<h2>`, etc.)
  - Navigation links to letter sections
  - Footnotes section
- Create `scripts/converters/html_converter.py`
- Implement `convert_to_html(data, output_path)` function using Jinja2

**Validation**: Generated HTML file renders correctly in browsers, all terms present, styling applied

**Dependencies**: Task 3 (can be done in parallel with Task 5)

---

## Phase 3: Document Formats

### - [x] 7. Implement Word (.docx) converter

**Description**: Create Word document output using the `python-docx` library.

**Actions**:
- Ensure `python-docx` is installed (already added to requirements.txt in Task 2)
- Create `scripts/converters/docx_converter.py`
- Implement `convert_to_docx(data, output_path)` function
- Create document structure with:
  - Title page with document title
  - Section headings for each letter group
  - Table with two columns (English word, Chinese meaning)
  - Proper page margins and styling
- Handle footnote rendering

**Validation**: Generated `.docx` file opens in Word/LibreOffice with correct formatting and all terms

**Dependencies**: Task 3

---

### - [x] 8. Implement PDF converter

**Description**: Create PDF output using HTML-to-PDF conversion (weasyprint or pdfkit).

**Actions**:
- Choose PDF generation library (weasyprint recommended for Python)
- Ensure `weasyprint` is installed (already added to requirements.txt in Task 2)
- Create `scripts/converters/pdf_converter.py`
- Implement `convert_to_pdf(data, output_path)` function that:
  - Reuses HTML template from Task 5
  - Converts HTML to PDF
  - Configures page size, margins, and print-friendly settings
- Add table of contents generation if supported by library

**Validation**: Generated PDF file opens correctly, all pages present, formatting suitable for printing

**Dependencies**: Task 6 (HTML converter)

---

## Phase 4: CLI Integration

### - [x] 9. Create unified CLI entry point

**Description**: Build the main `convert_data.py` script with argparse for CLI interface.

**Actions**:
- Create `scripts/convert_data.py` as the main entry point
- Use `argparse` to implement CLI arguments:
  - `--format` or `-f`: Specify format(s) (comma-separated, or `all` for all formats)
  - `--output` or `-o`: Custom output directory (default: `dist/`)
  - `--help` or `-h`: Display help message
- Implement format routing to call appropriate converter functions
- Add `main()` function with error handling

**Validation**: Running with various arguments produces expected outputs, help message displays correctly

**Dependencies**: Tasks 4, 5, 6, 7, 8 (all converters must exist)

---

### - [x] 10. Add error handling and validation

**Description**: Add comprehensive error handling and user-friendly error messages.

**Actions**:
- Add validation for input file existence (`data.yaml`)
- Add validation for format argument (must be one of supported formats)
- Handle conversion errors gracefully with clear error messages
- Add dry-run mode (`--dry-run` flag) to validate without generating files
- Add verbose mode (`--verbose` flag) for detailed progress output

**Validation**: Error conditions produce helpful messages, dry-run works correctly

**Dependencies**: Task 9

---

### - [x] 11. Update requirements.txt documentation

**Description**: Update `requirements.txt` with final dependencies and comprehensive documentation.

**Actions**:
- Review and finalize `requirements.txt` (initial version created in Task 2)
- Ensure all dependencies have version pins (use `>=x.y.z,<a.b.c` format)
- Add detailed comments explaining:
  - Which format requires each dependency
  - Virtual environment setup instructions
  - Installation commands for different platforms
- Add a README section or `docs/setup.md` documenting:
  - How to create and activate the virtual environment
  - How to install dependencies
  - How to verify installation

**Validation**: `pip install -r requirements.txt` successfully installs all dependencies; documentation is clear and complete

**Dependencies**: Task 8 (PDF converter - to finalize library choice)

---

## Phase 5: Documentation and Testing

### - [x] 12. Create usage documentation

**Description**: Write comprehensive documentation for using the conversion script.

**Actions**:
- Create `docs/conversion-guide.md` or add to existing README
- Document usage examples:
  - Setting up the virtual environment
  - Activating the virtual environment
  - Converting to single format
  - Converting to multiple formats
  - Using custom output directory
- List all supported formats with descriptions
- Document troubleshooting for common issues (e.g., PDF generation failures, missing dependencies)

**Validation**: Documentation covers all CLI features and includes working examples

**Dependencies**: Task 10

---

### - [x] 13. Add integration validation script

**Description**: Create a validation script to verify all conversions maintain data integrity.

**Actions**:
- Create `scripts/validate_conversions.py`
- Implement checks:
  - Term count consistency between `data.yaml` and each output format
  - Footnote reference integrity
  - File existence and readability
- Add option to validate specific formats or all formats
- Return exit code 0 if all validations pass, 1 otherwise

**Validation**: Running validation on all generated formats confirms data integrity

**Dependencies**: Task 10

---

### 14. Add GitHub Actions workflow (optional)

**Description**: Create automated conversion workflow for CI/CD (optional enhancement).

**Actions**:
- Create `.github/workflows/convert-data.yml`
- Configure workflow to:
  - Set up Python virtual environment
  - Install dependencies from `requirements.txt`
  - Run conversion script on `data.yaml` changes
- Trigger on push to `main` branch when `data.yaml` changes
- Upload generated artifacts as workflow attachments
- Optionally create a GitHub Release with generated files on tag push

**Validation**: Workflow runs successfully on push, artifacts are available for download

**Dependencies**: Task 11

---

## Task Summary

| Phase | Tasks | Can Parallelize |
|-------|-------|-----------------|
| 1. Foundation | 1-3 | Yes |
| 2. CSV Format | 4 | No (depends on 3) |
| 3. Template Formats | 5-6 | Yes (both depend on 3) |
| 4. Document Formats | 7-8 | No (sequential dependencies) |
| 5. CLI Integration | 9-11 | No (sequential dependencies) |
| 6. Documentation | 12-14 | Partial (13 depends on 10) |

**Total Tasks**: 14

**Critical Path**: 1 → 2 → 3 → 4 → 5 → 6 → 8 → 9 → 10 → 11 → 12 → 13

**Parallelizable Opportunities**:
- Tasks 1, 2, and 3 can run in parallel
- Tasks 5 and 6 can run in parallel
- Task 7 can run in parallel with 8 (though 8 depends on 6)
- Tasks 12 and 13 can run in parallel after Task 10
