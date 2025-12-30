# Proposal: GitHub Actions Build Artifacts and Release Automation

## Summary

Add GitHub Actions workflows to automatically build and upload conversion artifacts during PR builds, main branch builds, and releases.

## Why

The project currently lacks automated artifact management in its CI/CD pipeline. This creates friction in the development workflow and reduces traceability of build outputs.

## Background

The project is a TypeScript-based CLI tool that converts `data.yaml` (computer terminology cross-reference data) into multiple formats: Markdown, HTML, Word (.docx), CSV, and PDF. Build artifacts are generated via `npm run build && npm run convert:all` and output to the `dist/` directory.

Currently, the project has only one GitHub Actions workflow (`release-drafter.yml`) that automatically generates release notes. This creates several workflow gaps:

1. **PR builds lack artifact visibility** - Reviewers cannot access or verify build artifacts during code review
2. **Main branch builds have no artifact retention** - Build artifacts from main branch commits are not archived
3. **Release publishing requires manual steps** - Release assets must be manually uploaded when creating releases

## Goals

1. Enable artifact uploads for PR builds so reviewers can download and inspect conversion outputs
2. Automatically archive build artifacts on main branch pushes for traceability
3. Automatically attach build artifacts to GitHub releases when published

## Non-Goals

- Publishing to npm registry
- Modifying the existing build process or CLI commands
- Changing the release-drafter workflow configuration

## Proposed Solution

Create a new GitHub Actions workflow file (e.g., `build.yml`) that handles three trigger scenarios:

### 1. Pull Request Builds
- **Trigger**: `pull_request` events targeting main branch
- **Action**: Build and upload artifacts using `actions/upload-artifact@v4`
- **Benefit**: Reviewers can download artifacts from the PR checks page

### 2. Main Branch Builds
- **Trigger**: `push` events to main branch
- **Action**: Build and upload artifacts with configurable retention
- **Benefit**: Historical build records for debugging and audit

### 3. Release Publishing
- **Trigger**: `release` events (created, published)
- **Action**: Build and attach artifacts to the release using `softprops/action-gh-release@v1`
- **Overwrite policy**: Existing assets with the same name are replaced
- **Benefit**: Automated release asset publishing

## Impact

### Expected Benefits
- **Improved development workflow**: Reviewers can inspect build outputs directly from PR pages
- **Better traceability**: Every build has downloadable artifacts
- **Automated releases**: No manual asset uploads required when publishing releases

### Scope of Changes
- New file: `.github/workflows/build.yml`
- No changes to source code, CLI commands, or build process
- No changes to existing `release-drafter.yml` workflow

### Dependencies
- GitHub Actions permissions: `contents: write` for artifact and release uploads
- Existing build commands: `npm run build && npm run convert:all`

## Alternatives Considered

1. **Separate workflows per trigger** - Rejected due to code duplication; a single workflow with conditional jobs is more maintainable

2. **Using `actions/upload-release-asset@v1`** - Rejected in favor of `softprops/action-gh-release@v1` which handles multiple assets, overwrites, and has better maintenance

3. **Generating artifacts on every branch** - Rejected to minimize CI/CD costs; main and PR branches are sufficient

## Open Questions

None at this time.
