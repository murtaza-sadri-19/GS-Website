# User Roles

Five roles. Fixed list. Stored in the `roles` table; new roles require a schema change.

| Role | Main purpose |
| --- | --- |
| `CENTRAL_ADMIN` | Super admin: users, departments, pages, global notices, downloads, gallery, all global content |
| `EXAM_CONTROLLER` | Exam notices, timetables, results, academic calendar |
| `PLACEMENT_OFFICER` | Placement notices, company visits, placement records, training programs |
| `HOD` | Manages own department: profile, teachers, dept notices, downloads, events, labs, gallery, achievements |
| `TEACHER` | Manages own faculty profile: qualifications, subjects, publications, research |

## CENTRAL_ADMIN

| Responsibility | Details |
| --- | --- |
| Manage users | Create/manage Exam Controller, Placement Officer, HOD, Teacher accounts |
| Manage departments | Add, update, activate, deactivate departments |
| Manage notices | Publish college-level notices |
| Manage events | Publish college-level events |
| Manage gallery | Upload and manage college-level gallery images |
| Manage pages | Edit dynamic pages like About, Administration, Contact |
| Manage downloads | Upload college-level forms, circulars, PDFs |
| View audit logs | Track important dashboard activities |

## EXAM_CONTROLLER

| Responsibility | Details |
| --- | --- |
| Exam notices | Upload and update examination notices |
| Exam timetables | Upload timetable PDFs |
| Results | Upload result PDFs or result links |
| Academic calendar | Upload academic calendar document |
| File management | Upload exam-related files |

## PLACEMENT_OFFICER

| Responsibility | Details |
| --- | --- |
| Placement notices | Publish placement announcements |
| Company visits | Add upcoming and past company visits |
| Placement records | Add year-wise placement statistics |
| Training programs | Add training, seminar, workshop details |
| File management | Upload placement brochures and reports |

## HOD

| Responsibility | Details |
| --- | --- |
| Department profile | Update department intro, vision, mission, images |
| Manage teachers | Add and update teachers of own department |
| Department notices | Publish department-specific notices |
| Department downloads | Upload syllabus, circulars, forms |
| Department events | Add department events |
| Department gallery | Upload department images |
| Labs | Add and update lab details |
| Achievements | Add student, faculty, department achievements |

**Hard constraint:** an HOD CANNOT touch another department's data. Enforced in middleware/service via `req.user.department_id === target.department_id`.

## TEACHER

| Responsibility | Details |
| --- | --- |
| My profile | Update public teacher profile |
| Publications | Add publications and papers |
| Research work | Add research areas, projects, patents |
| Subjects | Add subjects taught |
| Qualifications | Add academic qualifications |

**Hard constraint:** a TEACHER CANNOT edit another teacher's profile. Enforced via `req.user.id === facultyProfile.user_id`.

## Access restriction summary

| Role | Restriction |
| --- | --- |
| CENTRAL_ADMIN | Can manage all departments and global content |
| HOD | Can manage only own department's data |
| TEACHER | Can manage only own faculty profile |
| EXAM_CONTROLLER | Can manage only exam module |
| PLACEMENT_OFFICER | Can manage only placement module |

## Seed data

The first CENTRAL_ADMIN is created by a seed script (`backend/src/scripts/seed.js`) — never via API. All other users are created by CENTRAL_ADMIN via the dashboard. See `../03-modules/users/`.
