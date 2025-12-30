# Design Document: data-yaml-multi-format-converter

## Overview

This document describes the architectural design and technical decisions for the multi-format data.yaml converter system.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         convert_data.py                          │
│                      (CLI Entry Point)                          │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │   Common Loader   │
                    │  (common.py)      │
                    └─────────┬─────────┘
                              │
                    ┌─────────┴───────────────────────────────────┐
                    │         data.yaml (Source Data)             │
                    └─────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐      ┌──────────────┐
│ CSV          │    │ Templates    │      │ Converters   │
│ Converter    │    │ (Jinja2)     │      │ (Format      │
│              │    │              │      │  Specific)   │
└──────────────┘    └──────────────┘      └──────────────┘
                          │                      │
            ┌─────────────┴──────────┐   ┌──────┴──────┐
            ▼                        ▼   ▼             ▼
      ┌─────────┐            ┌──────────┐  ┌─────┐  ┌─────┐
      │Markdown │            │   HTML   │  │DOCX │  │ PDF │
      │Template │            │ Template │  │     │  │     │
      └─────────┘            └──────────┘  └─────┘  └─────┘
            │                        │              │      │
            ▼                        ▼              ▼      ▼
      ┌─────────┐            ┌──────────┐  ┌─────┐  ┌─────┐
      │ dist/   │            │ dist/    │  │dist/│  │dist/│
      │markdown/│            │ html/    │  │docx/│  │ pdf/│
      └─────────┘            └──────────┘  └─────┘  └─────┘
```

## Directory Structure

```
computerese-cross-references/
├── data.yaml                      # Source data (existing)
├── .venv/                         # Python virtual environment (new, gitignored)
├── scripts/
│   ├── convert_data.py            # Main CLI entry point (new)
│   ├── common.py                  # Shared data loader (new)
│   ├── converters/                # Format-specific converters (new)
│   │   ├── __init__.py
│   │   ├── csv_converter.py
│   │   ├── markdown_converter.py
│   │   ├── html_converter.py
│   │   ├── docx_converter.py
│   │   └── pdf_converter.py
│   └── templates/                 # Jinja2 templates (new)
│       ├── markdown/
│       │   └── terms.j2
│       └── html/
│           └── terms.j2
├── dist/                          # Generated output (new, gitignored)
│   ├── csv/
│   ├── markdown/
│   ├── html/
│   ├── docx/
│   └── pdf/
├── requirements.txt               # Python dependencies (new)
└── README.md                      # Updated with setup instructions
```

## Component Design

### 1. Common Data Loader (`common.py`)

**Purpose**: Single source of truth for loading `data.yaml`.

**Interface**:
```python
def load_data_yaml(yaml_path: str) -> dict:
    """Load and parse data.yaml file.

    Args:
        yaml_path: Path to data.yaml file

    Returns:
        Dictionary with 'terms' and 'footnotes' keys

    Raises:
        FileNotFoundError: If yaml_path doesn't exist
        ValueError: If YAML structure is invalid
    """
```

**Rationale**: Centralizing data loading ensures consistency across all converters and makes changes to data structure easier to manage.

---

### 1.1 Virtual Environment Setup

**Purpose**: Isolate project dependencies and ensure reproducible builds across different environments.

**Setup Commands**:
```bash
# Create virtual environment
python -m venv .venv

# Activate (Unix/macOS)
source .venv/bin/activate

# Activate (Windows)
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

**requirements.txt**:
```
# Core dependencies for data.yaml converter
# Format-specific dependencies noted below

# YAML parsing (required for all formats)
pyyaml>=6.0,<7.0

# Template rendering (required for Markdown and HTML)
jinja2>=3.1.0,<4.0.0

# Word document generation (required for DOCX format)
python-docx>=1.0.0,<2.0.0

# PDF generation (required for PDF format)
weasyprint>=60.0,<62.0
```

**Rationale**:
- Python's built-in `venv` module requires no external tools
- Version pins (`>=x.y.z,<a.b.c`) ensure compatibility while allowing patch updates
- Isolated environment prevents conflicts with system Python packages
- Virtual environment is gitignored to avoid committing platform-specific binaries

---

### 2. Converter Base Pattern

Each converter follows a consistent interface:

```python
def convert_to_<format>(data: dict, output_path: str) -> None:
    """Convert data.yaml to <format> and write to output_path.

    Args:
        data: Parsed data.yaml dictionary
        output_path: Full path to output file

    Raises:
        IOError: If file cannot be written
        ConversionError: If conversion fails
    """
```

**Rationale**: Consistent interface makes the CLI routing simple and allows for easy addition of new formats.

---

### 3. Template System

**Technology**: Jinja2

**Rationale**:
- Python-native, no additional build steps
- Supports inheritance and includes for DRY templates
- Good error messages for debugging
- Widely used and well-documented

**Template Structure**:

Markdown (`templates/markdown/terms.j2`):
```jinja
# 计算机专业术语对照

{% for letter in terms %}
## {{ letter }}

| English | Chinese |
|---------|---------|
{% for term in terms[letter] %}| {{ term.word }} | {{ term.meaning }}{% if term.footnotes %}{{ '<sup>' ~ term.footnotes|join(',</sup><sup>') ~ '</sup>' }}{% endif %} |
{% endfor %}

{% endfor %}

## 脚注

{% for num, text in footnotes %}
[{{ num }}] {{ text }}
{% endfor %}
```

HTML (`templates/html/terms.j2`):
```jinja
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>计算机专业术语对照</title>
    <style>
        /* Embedded CSS for styling */
        body { font-family: system-ui, sans-serif; max-width: 1200px; margin: 0 auto; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        .footnote { font-size: 0.8em; vertical-align: super; }
    </style>
</head>
<body>
    <!-- Semantic HTML structure -->
</body>
</html>
```

---

### 4. CLI Design

**Technology**: Python `argparse`

**Argument Specification**:
```
convert_data.py [-h] [-f FORMAT [FORMAT ...]] [-o OUTPUT] [--dry-run] [-v]

options:
  -h, --help            Show help message and exit
  -f, --format FORMAT   Output format(s): csv, markdown, html, docx, pdf, all (default: all)
  -o, --output OUTPUT   Output directory (default: dist/)
  --dry-run             Validate without generating files
  -v, --verbose         Show detailed progress
```

**Usage Examples**:
```bash
# Setup virtual environment (first time only)
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows

# Install dependencies (first time only)
pip install -r requirements.txt

# Convert to all formats
python scripts/convert_data.py

# Convert to specific formats
python scripts/convert_data.py -f markdown html

# Custom output directory
python scripts/convert_data.py -f pdf -o ./output/

# Dry run to validate
python scripts/convert_data.py --dry-run

# Verbose output
python scripts/convert_data.py -f docx -v
```

---

## Technology Choices

### Dependency Management: Python `venv`
- **Pros**: Built-in module (no external tools), cross-platform, isolates project dependencies
- **Version Pinning**: Uses `requirements.txt` with `>=x.y.z,<a.b.c` format for stability
- **Alternatives Considered**:
  - `poetry`/`pipenv`: Additional tooling overhead, overkill for this project
  - `conda`: Heavier weight, not cross-platform by default
  - System Python: Risk of dependency conflicts, not reproducible

### CSV: Built-in `csv` module
- **Pros**: No dependencies, handles UTF-8, standard library
- **Cons**: None for this use case

### Markdown/HTML: Jinja2
- **Pros**: Native Python, expressive templates, good ecosystem
- **Alternatives Considered**:
  - `string.Template`: Too basic
  - Mako/Tornado: Less popular, unnecessary complexity
  - External CLI tools: Adds subprocess complexity

### Word: `python-docx`
- **Pros**: Pure Python, no Word installation required, good API
- **Alternatives Considered**:
  - `docxtpl`: Adds complexity for our simple use case
  - `pywin32`: Requires Windows/Word installation, not cross-platform

### PDF: `weasyprint`
- **Pros**: Pure Python, CSS-based styling (reuses HTML), no external dependencies
- **Alternatives Considered**:
  - `pdfkit`: Requires wkhtmltopdf binary installation
  - `reportlab`: Lower-level, more code required
  - `fpdf`: Limited CSS support

---

## Error Handling Strategy

### Input Validation
- File existence check for `data.yaml`
- YAML structure validation
- Format argument validation

### Conversion Errors
- Graceful failure with clear error messages
- Partial output cleanup on failure
- Exit codes for scripting integration

### User Feedback
- Progress indicators for multi-format conversions
- Verbose mode for debugging
- Dry-run mode for validation

---

## Extension Points

### Adding New Formats

To add a new output format:

1. Create `scripts/converters/<format>_converter.py`
2. Implement `convert_to_<format>(data, output_path)` function
3. Add format to `SUPPORTED_FORMATS` list in `convert_data.py`
4. Create `dist/<format>/` subdirectory handling (automatic)
5. Update documentation

### Custom Templates

Users can override default templates by:
1. Creating `templates/` directory in project root
2. Adding custom `.j2` files matching template names
3. CLI will check custom templates before falling back to defaults

---

## Testing Strategy

### Unit Testing
- Test each converter independently with mock data
- Test common loader with various YAML structures
- Test template rendering with edge cases (empty terms, special characters)

### Integration Testing
- Test full conversion pipeline with real `data.yaml`
- Verify output file existence and basic validity
- Cross-validate term counts between formats

### Validation Script
- Separate `validate_conversions.py` for post-conversion checks
- Can be run independently or as part of CI/CD

---

## Security Considerations

- No external network requests
- No user input execution (eval/exec)
- File paths validated before writing
- UTF-8 encoding enforced for all text output
- No sensitive data in `data.yaml`

---

## Performance Considerations

- Templates compiled once and reused
- Data loaded once per invocation
- Formats converted sequentially (not parallel) to avoid memory issues
- Estimated runtime: <5 seconds for all formats on typical dataset

---

## Maintenance Notes

### Dependencies to Monitor
- `jinja2`: Active project, stable
- `python-docx`: Maintained, infrequent updates
- `weasyprint`: Active, may have system dependency issues on some distros

### Future Enhancements (Out of Scope)
- Concurrent conversion for large datasets
- Incremental conversion (only changed formats)
- Web UI for format selection
- API endpoint for on-demand conversion
