# Tasks: GitHub Actions Build Artifacts and Release Automation

## Implementation Tasks

### Task 1: Create GitHub Actions workflow file scaffold

**Description**: Create the `.github/workflows/build.yml` file with basic structure and triggers.

**Validation**:
- [x] File exists at `.github/workflows/build.yml`
- [x] YAML is valid (can be parsed)
- [x] Includes triggers for `pull_request`, `push` to main, and `release` events

**Dependencies**: None

---

### Task 2: Configure workflow triggers and permissions

**Description**: Configure the workflow to trigger on the correct events and set appropriate permissions.

**Validation**:
- [x] Workflow triggers on:
  - `pull_request` events targeting main branch
  - `push` events to main branch
  - `release: types: [published]` events
- [x] `permissions: contents: write` is set

**Dependencies**: Task 1

---

### Task 3: Implement build job with checkout and setup

**Description**: Add steps to checkout code, setup Node.js, and install dependencies.

**Validation**:
- [x] Uses `actions/checkout@v4`
- [x] Uses `actions/setup-node@v4` with Node.js 18+
- [x] Uses `npm ci` for dependency installation

**Dependencies**: Task 2

---

### Task 4: Implement build and conversion steps

**Description**: Add steps to build the project and run all format conversions.

**Validation**:
- [x] Runs `npm run build`
- [x] Runs `npm run convert:all`
- Build completes successfully

**Dependencies**: Task 3

---

### Task 5: Implement PR artifact upload

**Description**: Add conditional artifact upload step for pull request events.

**Validation**:
- [x] Uploads `dist/` directory as artifact
- Artifact name includes commit SHA
- Artifact retention set to 7 days
- Only runs on `pull_request` events

**Dependencies**: Task 4

---

### Task 6: Implement main branch artifact upload

**Description**: Add conditional artifact upload step for main branch pushes.

**Validation**:
- [x] Uploads `dist/` directory as artifact
- Artifact name includes commit SHA
- Artifact retention set to 30 days
- Only runs on `push` events to main branch

**Dependencies**: Task 4

---

### Task 7: Implement release asset attachment

**Description**: Add conditional release asset attachment step for published releases.

**Validation**:
- [x] Uses `softprops/action-gh-release@v1`
- Attaches all files from `dist/` directory
- Only runs on `release: published` events
- Uses `fail_on_unmatched_files: true`

**Dependencies**: Task 4

## Task Ordering

```
Task 1 (scaffold)
    ↓
Task 2 (triggers & permissions)
    ↓
Task 3 (checkout & setup)
    ↓
Task 4 (build & convert)
    ↓
    ├→ Task 5 (PR artifacts)
    ├→ Task 6 (main artifacts)
    └→ Task 7 (release assets)
```

## Parallelizable Work

- Tasks 5, 6, and 7 can be developed in parallel after Task 4 is complete
