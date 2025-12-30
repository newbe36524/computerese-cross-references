# Project Context

## Purpose

This project provides a multi-format data converter for computer terminology cross-references. It maintains a structured `data.yaml` file containing 1029+ computer science terms with English-Chinese translations, and converts this data into various output formats (CSV, Markdown, HTML, Word (.docx), PDF) for different use cases including documentation, publishing, and data analysis.

## Tech Stack

### Core Technologies
- **TypeScript** - Primary language (ES modules)
- **Node.js** - Runtime environment (>=18.0.0)
- **Commander.js** - CLI framework
- **Handlebars** - Template rendering for Markdown/HTML

### Format-Specific Dependencies
- **docx** - Word (.docx) document generation
- **Puppeteer** - PDF generation via HTML rendering
- **yaml** - YAML parsing and validation

### Development Tools
- **TypeScript Compiler (tsc)** - Build tool
- **OpenSpec** - Spec-driven development workflow
- **GitHub Actions** - CI/CD automation

## Project Conventions

### Code Style
- **ES Module syntax** - Use `import`/`export` with `.js` extensions in imports
- **TypeScript strict mode** - All types must be properly defined
- **Functional patterns** - Prefer pure functions, avoid class hierarchies
- **Lazy loading** - Converters are dynamically imported to avoid unnecessary dependencies
- **Async/await** - Use for all asynchronous operations

### Naming Conventions
- **Files**: `camelCase.ts` (e.g., `convertData.ts`, `csvConverter.ts`)
- **Functions**: `camelCase` (e.g., `convertToCsv`, `loadDataYaml`)
- **Constants**: `UPPER_SNAKE_CASE` or `camelCase` for module constants
- **Types**: `PascalCase` (e.g., `DataYaml`, `ValidationResult`)

### Architecture Patterns

#### Directory Structure
```
src/
├── cli.ts              # Main CLI entry point
├── commands/           # CLI command implementations
│   ├── convertData.ts
│   ├── parseReadme.ts
│   ├── validateDataYaml.ts
│   └── validateConversions.ts
├── converters/         # Format-specific converters
│   ├── csvConverter.ts
│   ├── markdownConverter.ts
│   ├── htmlConverter.ts
│   ├── docxConverter.ts
│   └── pdfConverter.ts
├── common/             # Shared utilities
│   └── loadDataYaml.ts
├── templates/          # Handlebars templates
│   ├── markdown/
│   └── html/
└── types/              # TypeScript type definitions
    └── index.ts
```

#### Key Patterns
- **Converter pattern** - Each format has a dedicated converter module
- **Template pattern** - Markdown/HTML use Handlebars templates
- **Validation pipeline** - Multi-stage validation (format → count → footnotes → fields → groups)
- **Lazy imports** - Converters loaded on-demand to handle missing dependencies gracefully

### Output Structure
```
pkg/                    # Output directory (not dist/)
├── terms.csv
├── terms.md
├── terms.html
├── terms.docx
└── terms.pdf
```

**Note**: Output goes directly to `pkg/` without subfolder structure (unlike the old `dist/{format}/` pattern).

### Testing Strategy

**Validation approach** rather than unit tests:
- `npm run validate` - Full validation suite
- `npm run validate:data-yaml` - Validate data.yaml integrity
- `npm run validate:conversions` - Validate generated outputs

**Validation checks**:
1. YAML format correctness
2. Term count consistency with README.md
3. Footnote reference integrity
4. Required field presence (word, meaning)
5. Letter group completeness (A-Z coverage)

### Git Workflow

**Branching**: `master` is main branch

**Commit conventions**:
- Use conventional commit format when appropriate
- Reference OpenSpec change IDs when applicable: `(change-id) description`

**OpenSpec workflow**:
1. Create proposal for new features/architecture changes
2. Implement after approval
3. Archive after deployment

## Domain Context

### Data Structure

**data.yaml format**:
```yaml
terms:
  A:                      # Letter group (A-Z)
    - word: Abstract Factory
      meaning: 抽象工厂
    - word: AI
      meaning: Artificial Intelligence，人工智能
    - word: Algorithm-of-Thought
      meaning: 思维算法（AoT）
      footnotes: [6]       # Optional footnote references
footnotes:
  1: "Footnote text"
  # ... 2-6
```

**Key invariants**:
- 1029 terms total (as of current data)
- 26 letter groups (A-Z)
- Footnote references 1-6
- Each term MUST have `word` and `meaning`

### CLI Commands

**Conversion**:
```bash
npm run convert:all              # All formats
npm run convert:csv              # CSV only
npm run convert:markdown         # Markdown only
npm run convert:html             # HTML only
npm run convert:docx             # Word only
npm run convert:pdf              # PDF only
```

**Validation**:
```bash
npm run validate                 # Full validation
npm run validate:data-yaml       # data.yaml validation
npm run validate:conversions     # Output validation
```

**Parse README**:
```bash
npm run parse:readme             # Extract terms from README.md → data.yaml
```

## Important Constraints

### CI Environment Constraints
- **Puppeteer in CI** requires `--no-sandbox` and `--disable-setuid-sandbox` flags
- Detect CI via `process.env.CI`, `GITHUB_ACTIONS`, or `CI_NAME`
- Node.js 18 is the CI runtime version

### Data Integrity Constraints
- All 1029 terms from README.md must be preserved in data.yaml
- Footnote references must be valid (point to existing footnotes 1-6)
- All letter groups A-Z must be present
- Term count in data.yaml must match README.md table count

### Format-Specific Constraints
- **PDF generation** requires network idle state (`waitUntil: 'networkidle0'`)
- **Word documents** use table layout with specific column widths (45%/55%)
- **CSV** includes `letter` column for grouping
- **Markdown/HTML** use Handlebars templates requiring manual copy during build

## External Dependencies

### Runtime Dependencies
| Package | Version Range | Purpose |
|---------|---------------|---------|
| commander | ^12.0.0 | CLI framework |
| docx | ^8.5.0 | Word document generation |
| handlebars | ^4.7.8 | Template rendering |
| puppeteer | ^22.0.0 | PDF generation |
| yaml | ^2.4.0 | YAML parsing |

### Dev Dependencies
| Package | Version Range | Purpose |
|---------|---------------|---------|
| @types/node | ^20.11.0 | Node.js type definitions |
| typescript | ^5.3.3 | TypeScript compiler |

### Build Artifacts
- Templates must be copied: `cp -r src/templates dist/templates`
- Build output: `dist/` directory
- Package output: `pkg/` directory

## Project Documentation

### Documentation Files
- `README.md` - Project overview, quick start guide, and download links
- `CONTRIBUTING.md` - Contribution guidelines for new contributors
- `MAINTAINERS.md` - Maintenance handbook for project maintainers

### Documentation Standards
- All documentation uses Chinese for content
- Code blocks use appropriate language syntax highlighting
- Documentation should be updated alongside code changes

## Migration Notes

**Recent TypeScript migration (December 2025)**:
- Converted from Python to TypeScript
- Output directory changed from `dist/{format}/` to `pkg/`
- All functionality preserved from original Python scripts
- See `openspec/changes/typescript-migration-remove-python/` for details

**README Documentation Structure Update (December 2025)**:
- Added CONTRIBUTING.md with contribution guidelines
- Added MAINTAINERS.md with maintenance procedures
- Restructured README.md to focus on project introduction and quick start
- Removed A-Z term tables from README (available in pkg/terms.md)
- See `openspec/changes/readme-documentation-structure/` for details
