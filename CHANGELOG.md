# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Dual ESM and CommonJS builds with type declarations for every subpath.
- Vitest test suite with coverage, package validation, and CI automation.
- Version-aware release workflow for tags, npm publishing, and GitHub Releases.
- Documentation guides, runnable examples, and community health files.

### Fixed

- `customAsync()` now returns the validator so it can be chained.
- `createAsyncValidator()` and `createConditionalValidator()` now keep rules
  across chained calls.
- Required schema fields no longer also report a type error.
- `nestedSchema().partial()` now validates only the provided fields.
- `deepValidate()` now prefixes error messages as documented.
- IPv6 documentation now passes the required version argument.

## [1.0.1] - 2026-10-27

### Added

- npm and GitHub release badges to the README.

## [1.0.0] - 2026-08-23

### Added

- Chainable validator with email, phone, URL, password, and custom rules.
- Schema and nested schema validation with patterns and custom messages.
- Async, conditional, and batch validation helpers.
- TypeScript declarations and browser entry point.
- Zero runtime dependencies.

[Unreleased]: https://github.com/zelvarys/zelvar-validate/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/zelvarys/zelvar-validate/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/zelvarys/zelvar-validate/releases/tag/v1.0.0
