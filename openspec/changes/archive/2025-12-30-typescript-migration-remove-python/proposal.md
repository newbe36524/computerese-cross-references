# Change: TypeScript Migration - Remove Python

## Why

The project currently uses Python for all scripts (data.yaml parsing, validation, and multi-format conversion). Migrating to TypeScript will provide:

- **Type safety**: Catch errors at compile time rather than runtime
- **Better IDE support**: Enhanced autocomplete, refactoring, and navigation
- **Unified language ecosystem**: Leverage Node.js/TypeScript ecosystem and tooling
- **Easier maintenance**: Single language reduces cognitive load and dependency management
- **Better distribution**: Easier to package as npm packages with cross-platform executables

## What Changes

- **BREAKING**: All Python scripts will be replaced with TypeScript equivalents
- **NEW**: TypeScript project setup with `package.json`, `tsconfig.json`, and build configuration
- **NEW**: TypeScript converters implementing the same functionality as Python versions
- **NEW**: Node.js CLI entry points for all scripts
- **NEW**: TypeScript-based templates (using Handlebars or similar, replacing Jinja2)
- **REMOVE**: All Python scripts and `requirements.txt`
- **MODIFY**: Documentation to reference TypeScript/Node.js commands instead of Python

## Impact

- Affected specs: `data-conversion`, `term-data`
- Affected code:
  - `scripts/` directory (complete rewrite from Python to TypeScript)
  - `scripts/templates/` (migration from Jinja2 to TypeScript-compatible templating)
  - `requirements.txt` (removed, replaced by `package.json`)
  - `package.json` (NEW)
  - `tsconfig.json` (NEW)
  - `.gitignore` (update for Node.js/TypeScript artifacts)

## Migration Path

1. Set up TypeScript project structure
2. Port core utilities (YAML parsing, common functions)
3. Port each converter (CSV, Markdown, HTML, DOCX, PDF)
4. Port validation scripts
5. Update documentation
6. Remove Python files after validation

## Backward Compatibility

This is a **breaking change**. Users who have integrated the Python scripts into their workflows will need to:

- Use `npm run` commands instead of `python scripts/` commands
- Ensure Node.js (v18+) is installed instead of Python
- Update any automation scripts that call the Python scripts directly
