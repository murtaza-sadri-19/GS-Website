# <spec-name> — Requirements

> What to build and why. **No implementation details, no code, no SQL.**

## Purpose

<TODO: 1-3 sentences explaining what this feature does for the college and why it exists.>

## Actors and what they can do

| Role | Can do |
| --- | --- |
| <TODO: e.g., CENTRAL_ADMIN> | <TODO: e.g., create, update, delete, list all> |
| <TODO: HOD> | <TODO: e.g., create/edit only own department's records> |
| Public visitor | <TODO: e.g., view PUBLISHED records only> |

## Data this feature handles

- <TODO: list the fields the user enters or sees>
- <TODO: any files uploaded?>
- <TODO: any references to other modules (department, user, file)?>

## Acceptance criteria

Testable bullets. Each one should be answerable yes/no after implementation.

- [ ] <TODO: e.g., A CENTRAL_ADMIN can create a notice via POST /notices and it appears in GET /notices within 1 request.>
- [ ] <TODO: e.g., An HOD cannot edit a notice belonging to another department; the API returns 403.>
- [ ] <TODO: e.g., A public GET /notices excludes records with status = 'DRAFT' or 'ARCHIVED'.>
- [ ] <TODO: e.g., Every create/update/delete writes an entry to audit_logs.>

## Out of scope

<TODO: explicitly list things that this spec does NOT cover, so reviewers don't ask.>

## Open questions

<TODO: anything you'd ask the product owner. Remove this section before marking the spec ready.>
