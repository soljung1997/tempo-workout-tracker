# Modeling Guidelines

## User-Editable Lookup Data

Categories, muscle groups, equipment types, and workout types are modeled as database-backed entities rather than TypeScript enums where users can add or hide values.

#Normalized Names

Models that support user-defined labels may include `normalizedName`.

`normalizedName` is:
- generated from `name`
- trimmed
- lowercased
- userd for duplicate checks and reactivation
- never displayed in the UI

## Soft Delete

User-editable lookup data should generally use `isActive` instead of hard deletion so historical references and reactivation remain possible.