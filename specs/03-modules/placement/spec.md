# Placement — Spec Stub

> 🟡 **Stub.** Expand into requirements/design/tasks before implementing.

## Tables touched

- `placement_records` ([schema](../../01-database/design.md#108-placement_records))
- `files` — optional attachment
- `audit_logs`

## Endpoints

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/placement/notices` | Public | record_type = NOTICE |
| GET | `/placement/company-visits` | Public | record_type = COMPANY_VISIT |
| GET | `/placement/records` | Public | record_type = PLACEMENT_RECORD |
| GET | `/placement/training-programs` | Public | record_type = TRAINING_PROGRAM |
| POST | `/placement/records` | PLACEMENT_OFFICER | Add record (any record_type) |
| PUT | `/placement/records/:id` | PLACEMENT_OFFICER | Update |
| DELETE | `/placement/records/:id` | PLACEMENT_OFFICER | Deactivate |

## Role / ownership

- PLACEMENT_OFFICER: all CUD.
- CENTRAL_ADMIN: also CUD.
- No department scoping.

## Required fields by record_type

| record_type | Required extras |
| --- | --- |
| NOTICE | title, description |
| COMPANY_VISIT | title, company_name, academic_year, description |
| PLACEMENT_RECORD | title, academic_year, description (file with stats recommended) |
| TRAINING_PROGRAM | title, description |

Encode in validators per `record_type`.

## File usage

`file_id` optional. Use files module with `usage=placement`.

## Notice cross-module

PLACEMENT_OFFICER also creates `notice_type=PLACEMENT` in the notices module. This module is for the records themselves (visits, stats, programs).
