# Design: GitHub Actions Build Artifacts and Release Automation

## Overview

This document describes the design for adding GitHub Actions workflows to automate build artifact uploads for PR reviews, main branch builds, and GitHub releases.

## Architecture

### Workflow Structure

```
.github/workflows/
├── release-drafter.yml  (existing - release notes generation)
└── build.yml            (new - build artifacts and release automation)
```

### Build Workflow Design

The `build.yml` workflow will use a job matrix with conditional execution based on the trigger event:

```
┌─────────────────────────────────────────────────────────────┐
│                    Trigger: Event                            │
└──────────────────────────┬──────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
         ┌────▼─────┐             ┌────▼─────┐
         │  PR      │             │  Push    │
         │  Event   │             │  Event   │
         └────┬─────┘             └────┬─────┘
              │                         │
              │                         │
         ┌────▼─────┐             ┌────▼─────┐
         │  Job:    │             │  Job:    │
         │  build   │             │  build   │
         │  &       │             │  &       │
         │  upload  │             │  upload  │
         │  artifact│             │  artifact│
         └──────────┘             └──────────┘
                           │
                           │
              ┌────────────┴────────────┐
              │                         │
         ┌────▼─────┐             ┌────▼─────┐
         │ Release  │             │  Main    │
         │ Event    │             │  Branch  │
         └────┬─────┘             └────┬─────┘
              │                         │
         ┌────▼─────┐             ┌────▼─────┐
         │  Job:    │             │  (also   │
         │  build   │             │   run    │
         │  &       │             │   same   │
         │  attach  │             │   job)   │
         │  release │             └──────────┘
         └──────────┘
```

## Component Design

### 1. Job: Build and Upload

**Steps:**
1. Checkout code (`actions/checkout@v4`)
2. Setup Node.js 18+ (`actions/setup-node@v4`)
3. Install dependencies (`npm ci`)
4. Build project (`npm run build`)
5. Convert all formats (`npm run convert:all`)
6. Conditionally upload artifacts or release assets

### 2. Artifact Upload Strategy

#### For PR Events
```yaml
- name: Upload PR artifacts
  uses: actions/upload-artifact@v4
  with:
    name: build-artifacts-${{ github.sha }}
    path: dist/
    retention-days: 7  # PR artifacts expire after 7 days
```

#### For Main Branch Push
```yaml
- name: Upload branch artifacts
  uses: actions/upload-artifact@v4
  with:
    name: build-artifacts-${{ github.sha }}
    path: dist/
    retention-days: 30  # Main branch artifacts retained longer
```

#### For Release Events
```yaml
- name: Attach release assets
  uses: softprops/action-gh-release@v1
  if: startsWith(github.event.action, 'published')
  with:
    files: |
      dist/markdown/terms.md
      dist/html/terms.html
      dist/docx/terms.docx
      dist/csv/terms.csv
      dist/pdf/terms.pdf
    fail_on_unmatched_files: true
```

## Permissions and Security

### Required Permissions
```yaml
permissions:
  contents: write  # Required for artifact and release uploads
```

### Security Considerations
- The workflow uses official GitHub Actions with pinned major versions (@v4, @v1)
- No secrets are required (uses `GITHUB_TOKEN` automatically)
- Artifact retention is configured to minimize storage costs

## Error Handling

### Build Failures
- If `npm run build` or `npm run convert:all` fails, the workflow fails immediately
- No artifacts are uploaded on build failure
- GitHub will display the failure in the PR checks or branch status

### Artifact Upload Failures
- Failed artifact uploads will fail the job
- Release asset uploads use `fail_on_unmatched_files: true` to catch missing outputs

## Configuration Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| `node-version` | `18` | Minimum Node.js version from package.json |
| `artifact-retention-pr` | `7 days` | PR artifacts retention period |
| `artifact-retention-main` | `30 days` | Main branch artifacts retention period |
| `release-files` | `dist/**/*` | All built format files |

## Trade-offs and Decisions

### Decision: Single Workflow with Conditionals
**Trade-off**: Slightly more complex YAML vs. multiple simple workflow files

**Rationale**:
- DRY principle - build steps are identical across all triggers
- Easier to maintain - one source of truth for build process
- Workflow dispatch can test all scenarios from one place

### Decision: Use `softprops/action-gh-release@v1`
**Trade-off**: Third-party action vs. official `actions/upload-release-asset@v1`

**Rationale**:
- Better maintained than the stale official action
- Supports wildcard patterns and multiple files
- Built-in overwrite behavior for existing assets
- Widely adopted (6k+ stars on GitHub)

### Decision: Short Retention for PR Artifacts
**Trade-off**: 7-day retention may be too short for long-running PRs

**Rationale**:
- Minimize storage costs
- PRs should be reviewed and merged within a week
- Main branch artifacts provide longer-term history

## Future Considerations

1. **Multi-platform builds**: Currently only builds on Linux; could add Windows/macOS if needed
2. **Artifact compression**: Could compress artifacts if `dist/` size becomes large
3. **Release automation**: Could add automatic release creation on tag push
4. **Matrix builds**: Could test against multiple Node.js versions
