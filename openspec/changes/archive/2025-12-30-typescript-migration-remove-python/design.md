# TypeScript Migration Design

## Context

The project currently uses Python for all scripts related to data.yaml processing, validation, and multi-format conversion. The Python implementation consists of:

- **Core utilities**: YAML parsing, data loading (`scripts/converters/common.py`)
- **Parsing script**: Extract terms from README.md (`scripts/parse_readme.py`)
- **Validation scripts**: Validate data.yaml integrity (`scripts/validate_data_yaml.py`, `scripts/validate_conversions.py`)
- **Converters**: Multi-format export (CSV, Markdown, HTML, DOCX, PDF)
- **Templates**: Jinja2 templates for Markdown and HTML generation

### Stakeholders

- Developers contributing to the project
- Users consuming the terminology data in various formats
- CI/CD pipelines running validation and conversion

### Constraints

- Must maintain identical output format to Python version
- Must support all existing conversion formats (CSV, Markdown, HTML, DOCX, PDF)
- Must preserve template-based generation approach
- Should minimize external dependencies where possible

## Goals / Non-Goals

### Goals

- Replace all Python scripts with functionally equivalent TypeScript code
- Maintain backward-compatible output formats
- Improve type safety and developer experience
- Enable cross-platform distribution via npm
- Reduce dependency management complexity (single ecosystem)

### Non-Goals

- Changing the output file formats or structures
- Modifying the data.yaml schema
- Adding new features during migration
- Performance optimization (maintain parity with Python version)

## Decisions

### Decision 1: TypeScript for Type Safety

**Choice**: Use TypeScript with strict type checking.

**Rationale**:
- Compile-time type checking reduces runtime errors
- Better IDE support (autocomplete, refactoring)
- Self-documenting code through type definitions

**Alternatives considered**:
- Plain JavaScript - rejected due to lack of type safety
- Flow - rejected due to declining adoption and IDE support

### Decision 2: YAML Parser Library

**Choice**: Use `yaml` (npm package) - a TypeScript-friendly YAML parser.

**Rationale**:
- Maintains compatibility with existing data.yaml format
- Good TypeScript support
- Active maintenance

**Alternatives considered**:
- `js-yaml` - rejected due to weaker TypeScript support
- Custom parser - rejected to avoid reimplementing YAML spec

### Decision 3: Template Engine Migration

**Choice**: Migrate from Jinja2 to **Handlebars** (`handlebars` npm package).

**Rationale**:
- Similar syntax to Jinja2 (lower migration friction)
- TypeScript/JavaScript native
- Good performance and ecosystem
- Logic-less templates align with best practices

**Alternatives considered**:
- EJS - rejected due to embedded JavaScript (less separation of concerns)
- Nunjucks - rejected due to closer similarity to Jinja2 but less popular
- Template literals - rejected for complex templates (harder to maintain)

### Decision 4: DOCX Generation Library

**Choice**: Use `docx` (npm package by Dolan).

**Rationale**:
- TypeScript/JavaScript native
- Similar API to python-docx (easier migration)
- Active maintenance

**Alternatives considered**:
- `docxtemplater` - rejected due to template-based approach (different paradigm)
- `officegen` - rejected due to limited formatting options

### Decision 5: PDF Generation Approach

**Choice**: Generate PDF from HTML using **Puppeteer**.

**Rationale**:
- Reuses HTML template (DRY principle)
- Consistent styling with HTML output
- Reliable rendering (uses Chrome engine)

**Alternatives considered**:
- `pdf-lib` - rejected due to manual layout complexity
- `jsPDF` - rejected due to limited styling support
- Direct HTML-to-PDF libraries - rejected due to inconsistent rendering

### Decision 6: CLI Framework

**Choice**: Use `commander` for CLI argument parsing.

**Rationale**:
- TypeScript-first design
- Simple, declarative API
- Generates help text automatically

**Alternatives considered**:
- `yargs` - rejected due to more complex API
- `oclif` - rejected as overkill for simple scripts
- Native `process.argv` - rejected for better UX

### Decision 7: Project Structure

**Choice**:

```
src/
├── cli.ts                    # Main CLI entry point
├── common/
│   └── loadDataYaml.ts      # YAML parsing and data loading
├── commands/
│   ├── parseReadme.ts       # Parse README.md to data.yaml
│   ├── validateDataYaml.ts  # Validate data.yaml
│   ├── convertData.ts       # Multi-format conversion
│   └── validateConversions.ts # Validate converted outputs
├── converters/
│   ├── csvConverter.ts
│   ├── markdownConverter.ts
│   ├── htmlConverter.ts
│   ├── docxConverter.ts
│   └── pdfConverter.ts
├── templates/
│   ├── markdown/
│   │   └── terms.hbs
│   └── html/
│       └── terms.hbs
└── types/
    └── index.ts             # TypeScript type definitions
```

**Rationale**:
- Mirrors Python structure for easier migration
- Clear separation of concerns
- Type definitions centralized

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| Library ecosystem differences may limit feature parity | High | Thorough testing of each converter against Python output |
| Template syntax differences cause output variations | Medium | Carefully migrate templates; implement diff testing |
| PDF rendering inconsistencies across platforms | Medium | Use Puppeteer with consistent Chrome version; add regression tests |
| Windows line ending/encoding issues | Low | Use consistent LF line endings; enforce UTF-8 |
| Increased bundle size for npm distribution | Low | Not publishing to npm; this is a project-local tool |

## Migration Plan

### Phase 1: Foundation (Tasks 1-3)
- Set up TypeScript project
- Define types
- Implement core utilities

### Phase 2: Core Scripts (Tasks 4-5)
- Port parsing and validation scripts
- Verify against Python versions

### Phase 3: Converters (Tasks 6-10)
- Port each converter individually
- Test output parity

### Phase 4: CLI Integration (Task 11)
- Port main conversion script
- Integrate all converters

### Phase 5: Testing & Cleanup (Tasks 12-16)
- Validation scripts
- Documentation updates
- Remove Python code

### Rollback Strategy

If issues arise during migration:
1. Keep Python scripts until TypeScript version is fully validated
2. Use feature flags or separate CLI commands for parallel operation
3. Git revert to previous state if blocking issues are found

## Open Questions

1. **Should we publish to npm?**
   - Current plan: No, this is a project-local tool
   - Revisit if external demand emerges

2. **Should we use a bundler (esbuild, webpack)?**
   - Current plan: No, direct tsc compilation is sufficient
   - Revisit if distribution needs arise

3. **How to handle template syntax differences?**
   - Jinja2: `{% for %}`, `{{ var }}`
   - Handlebars: `{{#each}}`, `{{var}}`
   - Plan: Manual migration with careful attention to logic differences
