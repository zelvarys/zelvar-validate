# Release process

Releases run from `.github/workflows/release.yml` when a commit lands on
`main`.

## Prepare a release

1. Bump the version:

   ```bash
   npm version patch --no-git-tag-version
   ```

   Use `minor` or `major` when appropriate.

2. Open a pull request and merge it to `main`.

The workflow compares the version in `package.json` with the existing git tags
and the npm registry.

## What the workflow does

1. Checks whether the version is new.
2. Runs linting, formatting checks, type checking, tests, and package checks.
3. Creates and pushes the `vX.Y.Z` git tag if it is missing.
4. Publishes to npm with the correct dist-tag if that version is not published.
5. Creates a GitHub Release with generated notes.

The steps are idempotent. If a publish fails, re-run the failed workflow and it
will resume without duplicating tags or releases.

## npm dist-tags

| Version pattern  | npm dist-tag | GitHub Release |
| ---------------- | ------------ | -------------- |
| `1.2.3`          | `latest`     | Latest release |
| `1.2.3-beta.1`   | `beta`       | Prerelease     |
| `1.2.3-rc.1`     | `rc`         | Prerelease     |
| other prerelease | `next`       | Prerelease     |

## Trusted publishing setup

The workflow uses npm trusted publishing with OpenID Connect. No `NPM_TOKEN`
secret is stored in the repository.

On npmjs.com, open the package settings and add a trusted publisher:

- Provider: GitHub Actions
- Organization or user: `zelvarys`
- Repository: `zelvar-validate`
- Workflow filename: `release.yml`
- Environment: `npm`

Create the `npm` environment in the GitHub repository settings. The workflow
requests `contents: write` and `id-token: write` permissions.

## Verify a release locally

```bash
npm run build
npm run check
npm pack --dry-run
```

The package should contain `dist/`, `README.md`, and `LICENSE`.
