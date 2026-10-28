# Security Policy

## Supported versions

| Version | Supported |
| ------- | --------- |
| 1.x     | Yes       |

## Reporting a vulnerability

Please do not open a public issue for security problems.

Use GitHub private vulnerability reporting:

https://github.com/zelvarys/zelvar-validate/security/advisories/new

Include the affected version, a description of the issue, and a minimal
reproduction if possible. You can expect an initial response within 48 hours.
Once the report is validated, a fix and release will be prepared as quickly as
possible.

## Scope

zelvar-validate is a validation library with zero runtime dependencies. It does
not make network requests, read files, or execute user-provided code beyond the
callbacks passed to the API.
