# CI Build Artifacts Specification

## Purpose

This specification defines requirements for automatically building and publishing project artifacts through GitHub Actions CI/CD workflows.

## ADDED Requirements

### Requirement: PR Build Artifact Upload

The system SHALL automatically upload build artifacts for pull requests to enable code review validation.

#### Scenario: PR artifact upload on pull request creation

- **GIVEN** a pull request is opened or updated targeting the main branch
- **WHEN** the GitHub Actions workflow is triggered
- **THEN** the project SHALL be built using `npm run build && npm run convert:all`
- **AND** build artifacts in the `dist/` directory SHALL be uploaded as GitHub Actions artifacts
- **AND** artifacts SHALL be available for download from the PR checks page
- **AND** artifacts SHALL expire after 7 days

#### Scenario: PR artifact naming with commit SHA

- **GIVEN** a pull request workflow uploads artifacts
- **WHEN** naming the artifact
- **THEN** the artifact name SHALL include the commit SHA (e.g., `build-artifacts-${{ github.sha }}`)
- **AND** reviewers SHALL be able to identify which commit generated the artifacts

#### Scenario: Build failure prevents artifact upload

- **GIVEN** a pull request workflow is running
- **WHEN** the build step (`npm run build && npm run convert:all`) fails
- **THEN** no artifacts SHALL be uploaded
- **AND** the workflow status SHALL show as failed
- **AND** the failure SHALL be visible on the PR checks page

### Requirement: Main Branch Build Artifact Archive

The system SHALL automatically archive build artifacts for main branch commits to maintain historical build records.

#### Scenario: Main branch artifact upload on push

- **GIVEN** a commit is pushed to the main branch
- **WHEN** the GitHub Actions workflow is triggered
- **THEN** the project SHALL be built using `npm run build && npm run convert:all`
- **AND** build artifacts in the `dist/` directory SHALL be uploaded as GitHub Actions artifacts
- **AND** artifacts SHALL be available for download from the Actions page

#### Scenario: Main branch artifact retention period

- **GIVEN** a main branch workflow uploads artifacts
- **WHEN** configuring artifact retention
- **THEN** artifacts SHALL be retained for 30 days
- **AND** artifacts SHALL automatically expire after the retention period

### Requirement: Release Asset Attachment

The system SHALL automatically attach build artifacts to GitHub releases when releases are published.

#### Scenario: Release asset attachment on release publish

- **GIVEN** a GitHub release is published (not just drafted)
- **WHEN** the GitHub Actions workflow is triggered by the release event
- **THEN** the project SHALL be built using `npm run build && npm run convert:all`
- **AND** all files in the `dist/` directory SHALL be attached to the release as release assets
- **AND** assets SHALL be available for download from the release page

#### Scenario: Release asset overwriting

- **GIVEN** a release already has an asset with the same name (e.g., `terms.md`)
- **WHEN** a new build attaches assets to the same release
- **THEN** the existing asset SHALL be overwritten with the new version
- **AND** only the latest version of each asset SHALL be available on the release

#### Scenario: Release assets include all format outputs

- **GIVEN** the build process completes successfully
- **WHEN** attaching assets to a release
- **THEN** the following files SHALL be attached:
  - `dist/markdown/terms.md`
  - `dist/html/terms.html`
  - `dist/docx/terms.docx`
  - `dist/csv/terms.csv`
  - `dist/pdf/terms.pdf`

### Requirement: Workflow Permissions

The GitHub Actions workflow SHALL have appropriate permissions to upload artifacts and release assets.

#### Scenario: Contents write permission for uploads

- **GIVEN** the GitHub Actions workflow is configured
- **WHEN** the workflow attempts to upload artifacts or release assets
- **THEN** the workflow SHALL have `contents: write` permission
- **AND** uploads SHALL succeed without permission errors

#### Scenario: Minimal permission principle

- **GIVEN** the GitHub Actions workflow requires permissions
- **WHEN** configuring workflow permissions
- **THEN** only `contents: write` permission SHALL be granted
- **AND** no additional permissions SHALL be requested
