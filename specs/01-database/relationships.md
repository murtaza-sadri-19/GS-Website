# Table Relationships

```
                                  ┌──────────┐
                                  │  roles   │
                                  └────┬─────┘
                                       │ 1:N
                                       ▼
              ┌────────────────────── users ─────────────────────────┐
              │                         │                            │
              │ N:1 (nullable)          │ 1:1                        │ 1:N
              ▼                         ▼                            ▼
      ┌──────────────┐         ┌──────────────────┐         ┌────────────────┐
      │ departments  │         │ faculty_profiles │         │  audit_logs    │
      └──────┬───────┘         └────────┬─────────┘         └────────────────┘
             │                          │
             │ 1:N (across content)     │ N:1 belongs to department
             ▼                          │
   ┌──────────────────────┐             │
   │ notices              │◄────────────┘
   │ downloads            │
   │ events               │
   │ gallery              │
   └──────────┬───────────┘
              │ many ──► files (via file_id / image_file_id columns)
              ▼
          ┌────────┐
          │ files  │
          └────────┘

   Exam / Placement / Pages are NOT department-scoped
   ─────────────────────────────────────────────────
   exam_documents     ──► files, users
   placement_records  ──► files, users
   pages              ──► users

   audit_logs         ──► users (records who did what)
```

## Cardinality cheat-sheet

| Pair | Cardinality |
| --- | --- |
| roles → users | 1 : N |
| departments → users | 1 : N (nullable) |
| users → faculty_profiles | 1 : 1 (only TEACHER role) |
| departments → faculty_profiles | 1 : N |
| departments → notices | 1 : N (nullable; general notices have no dept) |
| departments → downloads | 1 : N (nullable) |
| departments → events | 1 : N (nullable) |
| departments → gallery | 1 : N (nullable) |
| users → audit_logs | 1 : N |
| files → ANY module | 1 : N (one file referenced by many records) |

## Practical implications

- A general (college-wide) notice has `department_id = NULL`.
- A college-wide event has `department_id = NULL`.
- An HOD only sees rows where `department_id = their_department_id`.
- An EXAM_CONTROLLER only writes to `exam_documents`. No department scoping.
- A PLACEMENT_OFFICER only writes to `placement_records`. No department scoping.
- `pages` is always college-level — no department concept.
