# Faculty — Spec Stub

> 🟡 **Stub.** Expand into requirements/design/tasks before implementing.

## Tables touched

- `faculty_profiles` ([schema](../../01-database/design.md#104-faculty_profiles))
- `users` — joined to read TEACHER name/email
- `departments` — joined for department info
- `files` — profile image
- `audit_logs`

## Endpoints

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/faculty` | Public | All ACTIVE faculty (paginated, filterable by dept) |
| GET | `/faculty/:id` | Public | Profile detail |
| GET | `/departments/:deptId/faculty` | Public | Faculty of a department |
| POST | `/faculty` | CENTRAL_ADMIN, HOD (own dept) | Add profile for a TEACHER user |
| PUT | `/faculty/:id` | CENTRAL_ADMIN, HOD (own dept), TEACHER self | Update profile |
| DELETE | `/faculty/:id` | CENTRAL_ADMIN, HOD (own dept) | Deactivate |

## Role / ownership notes (THREE-way write access — highest complexity)

- CENTRAL_ADMIN: any profile.
- HOD: profiles where `profile.department_id = req.user.department_id`.
- TEACHER self: profiles where `profile.user_id = req.user.id`.

Service-level branching:

```
allowed =
  role === 'CENTRAL_ADMIN' ||
  (role === 'HOD' && profile.department_id === req.user.department_id) ||
  (role === 'TEACHER' && profile.user_id === req.user.id)
```

TEACHER cannot create profiles. Admin/HOD create one TEACHER user first (via users module), then create the profile linked to that user_id.

## Other constraints

- Exactly one profile per `user_id` (DB UNIQUE).
- Public list filters `status = ACTIVE`.
- Profile image upload via files module with `usage=faculty` (Cloudinary).
