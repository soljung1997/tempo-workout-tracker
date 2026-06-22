# Modeling Guidelines

## User-Editable Lookup Data

Categories, muscle groups, equipment types, and workout types are modeled as database-backed entities rather than TypeScript enums where users can add or hide values.

## Soft Delete

User-editable lookup data should generally use `is_active` instead of hard deletion so historical references and reactivation remain possible.

## Hard Delete

Hard delete is only to be used for user account deletion related processes, and means the complete and irreversible deletion of data.

## is_active

As mentioned in soft delete, is_active is the field that determines whether data is "deleted" by hiding it from the viewer. 1 means it has not been soft deleted, while 0 means it has been.

## normalized_name

`normalized_name` stores the trimmed, lowercase version of an entity's display name for duplicate checks and reactivation.

## Timestamp fields

- `created_at` is set when a row is inserted and should not change.
- `updated_at` is refreshed when a row is meaningfully modified.
- `deleted_at` is set when a row is soft-deleted.
- `scheduled_hard_delete_at` is reserved for future account/data removal flows.
- Timestamps are stored as ISO-8601 strings in SQLite `TEXT` columns.

## Default seed data vs user-created data

- Default seed data refers to the default data required for the application to be ready to use, e.g. default exercise types.
- User created data refers to user customized data enabling personalization of exercise types, muscle groups worked, type of workout, etc.