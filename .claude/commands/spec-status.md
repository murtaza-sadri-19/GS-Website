---
description: List all specs under specs/ and show progress (which have requirements/design/tasks filled in)
---

Walk the `specs/` directory and print a table of every spec folder with three checkmark columns: requirements, design, tasks.

A file counts as "filled" if it exists AND its content has more than 20 non-empty lines AND does not still contain the literal placeholder text `<TODO>` or `<spec-name>`.

After the table, print:
- Total specs found
- How many are fully filled (all three columns)
- The next 1-3 unfilled specs to work on, in roadmap order (00-foundation < 01-database < 02-auth < 03-modules < 04-frontend < 05-roadmap)

Do not modify any files. This is a read-only status report.
