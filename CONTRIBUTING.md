# Contributing

Thanks for taking the time to improve zelvar-validate. This guide covers the
local workflow and the release process.

## Requirements

- Node.js 22 or newer
- npm 10 or newer

## Setup

```bash
git clone https://github.com/zelvarys/zelvar-validate.git
cd zelvar-validate
npm install
```

## Scripts

| Command                 | Purpose                                        |
| ----------------------- | ---------------------------------------------- |
| `npm run build`         | Build ESM, CJS, and type declarations          |
| `npm run dev`           | Rebuild on file changes                        |
| `npm run typecheck`     | Run TypeScript without emitting files          |
| `npm run lint`          | Run ESLint                                     |
| `npm test`              | Build the package and run the Vitest suites    |
| `npm run test:coverage` | Build, run tests, and collect coverage         |
| `npm run check:package` | Validate package exports and type declarations |

Run `npm run check` before opening a pull request. It runs linting, type
checking, tests, and package validation.

## Pull requests

- Keep changes focused and describe the behavior that changed.
- Add tests for new rules, helpers, or bug fixes.
- Update the README and `docs/` when public behavior changes.
- Do not commit generated files from `dist/` or `coverage/`.

## Commit messages

Use short, conventional commit subjects where possible:

```text
feat: add a new validator helper
fix: handle empty optional schema fields
docs: document async validation
test: cover batch summaries
chore: update tooling
```

## Release process

Releases are automated by `.github/workflows/release.yml`.

1. Bump the version in `package.json` with `npm version <patch|minor|major>`.
2. Open a pull request and merge it to `main`.
3. The release workflow detects the new version, creates the `vX.Y.Z` tag,
   publishes to npm, and creates a GitHub Release.

Prerelease versions use the `next`, `beta`, or `rc` npm dist-tag. Stable
versions update the `latest` dist-tag.

## Reporting bugs

Open an issue with a minimal reproduction, the expected result, the actual
result, and your Node.js version. For security issues, use
[GitHub Security Advisories](https://github.com/zelvarys/zelvar-validate/security/advisories/new)
instead of opening a public issue.
