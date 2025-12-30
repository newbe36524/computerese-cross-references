# Data Format Conversion Guide

This guide explains how to convert `data.yaml` into various output formats including CSV, Markdown, HTML, Word (.docx), and PDF.

## Setup

### 1. Create and Activate Virtual Environment

First time setup requires creating a Python virtual environment to isolate project dependencies:

```bash
# Create virtual environment
python -m venv .venv

# Activate on Unix/macOS
source .venv/bin/activate

# Activate on Windows
.venv\Scripts\activate
```

### 2. Install Dependencies

Install the required Python packages:

```bash
pip install -r requirements.txt
```

### Dependencies

| Package | Version | Required For |
|---------|---------|--------------|
| pyyaml | >=6.0,<7.0 | All formats (YAML parsing) |
| jinja2 | >=3.1.0,<4.0.0 | Markdown, HTML (template rendering) |
| python-docx | >=1.0.0,<2.0.0 | Word (.docx) output |
| weasyprint | >=60.0,<62.0 | PDF output |

## Usage

### Basic Commands

Convert `data.yaml` to all formats:

```bash
python scripts/convert_data.py
```

Convert to specific formats only:

```bash
python scripts/convert_data.py -f markdown html
```

Use a custom output directory:

```bash
python scripts/convert_data.py -o ./output/
```

### Command-Line Options

| Option | Short | Description |
|--------|-------|-------------|
| `--format` | `-f` | Output format(s): csv, markdown, html, docx, pdf, all (default: all) |
| `--output` | `-o` | Output directory (default: dist/) |
| `--dry-run` | | Validate without generating files |
| `--verbose` | `-v` | Show detailed progress |
| `--data-yaml` | | Path to data.yaml file (default: data.yaml) |
| `--help` | `-h` | Show help message and exit |

### Examples

Convert to PDF only:

```bash
python scripts/convert_data.py -f pdf
```

Convert to Markdown and HTML with verbose output:

```bash
python scripts/convert_data.py -f markdown html -v
```

Dry run to validate data.yaml:

```bash
python scripts/convert_data.py --dry-run
```

Custom output directory:

```bash
python scripts/convert_data.py -f docx -o ./my-output/
```

## Output Structure

Generated files are organized under the `dist/` directory:

```
dist/
├── csv/
│   └── terms.csv
├── markdown/
│   └── terms.md
├── html/
│   └── terms.html
├── docx/
│   └── terms.docx
└── pdf/
    └── terms.pdf
```

## Supported Formats

| Format | Extension | Use Case |
|--------|-----------|----------|
| CSV | `.csv` | Data analysis, Excel import |
| Markdown | `.md` | Documentation, version control |
| HTML | `.html` | Web browsing, online publishing |
| Word | `.docx` | Editing, formal documents |
| PDF | `.pdf` | Print publishing, archiving |

## Troubleshooting

### Virtual Environment Issues

If you encounter Python environment issues:

```bash
# Deactivate first (if activated)
deactivate

# Remove and recreate
rm -rf .venv
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### PDF Generation Issues

WeasyPrint requires system-level dependencies on some platforms:

**Ubuntu/Debian:**
```bash
sudo apt-get install python3-dev python3-pip python3-cffi libcairo2 libpango-1.0-0 libpangocairo-1.0-0 libgdk-pixbuf2.0-0 libffi-dev shared-mime-info
```

**macOS:**
```bash
brew install python3 cairo pango gdk-pixbuf libffi
```

**Windows:**
WeasyPrint provides pre-built wheels that should install automatically.

### Missing Dependencies

If you see import errors:

```bash
pip install -r requirements.txt --upgrade
```

### data.yaml Not Found

Ensure you're running the command from the project root directory:

```bash
cd /path/to/computerese-cross-references
python scripts/convert_data.py
```

Or specify the path explicitly:

```bash
python scripts/convert_data.py --data-yaml /path/to/data.yaml
```

## Validation

Validate generated outputs using the validation script:

```bash
python scripts/validate_conversions.py
```

This checks:
- Term count consistency between formats
- Footnote reference integrity
- File existence and readability

## Automation

The conversion can be automated in CI/CD workflows. See `.github/workflows/` for example configurations.
