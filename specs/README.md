# Specs

This folder is the **source of truth** for what gets built. Every feature flows through three files:

```
<feature>/
├── requirements.md   What to build, why, who uses it, acceptance criteria
├── design.md         How: APIs, DB tables, services, edge cases
└── tasks.md          Atomic checkboxes in build order
```

Code follows specs. Specs do not follow code. If reality diverges from a spec, update the spec first, then the code.

## Layout

| Folder | Purpose |
| --- | --- |
| [`_template/`](./_template/) | Starter files copied by `/new-spec` |
| [`00-foundation/`](./00-foundation/) | Product overview, stack, roles, conventions, folder structures |
| [`01-database/`](./01-database/) | Full MySQL schema + relationships + setup tasks |
| [`02-auth/`](./02-auth/) | Login, JWT, middleware, RBAC, ownership rules |
| [`03-modules/`](./03-modules/) | One subfolder per backend module (13 total) |
| [`04-frontend/`](./04-frontend/) | Public pages, dashboards, routing, Axios setup |
| [`05-roadmap/`](./05-roadmap/) | Phased plan, first-implementation checklist, priorities, team division |

## Workflow

1. **Pick the next thing to build** — `05-roadmap/phases.md` gives the order.
2. **Scaffold the spec** if it doesn't exist: `/new-spec <path>`.
3. **Write requirements.md first.** No implementation details. If you can't write acceptance criteria, you don't understand the requirement yet.
4. **Write design.md second.** Reference exact table/column names from `01-database/design.md`, exact role rules from `02-auth/design.md`. Don't invent.
5. **Write tasks.md third.** Each task should be PR-sized (~30-90 min of work). Order matters: DB → service → controller → routes → tests → frontend wiring.
6. **Run `/review-spec <path>`** to catch gaps.
7. **Run `/implement-spec <path>`** to build. Tick off boxes as you go.

## Which specs are filled in?

- ✅ **Fully filled** — ready to implement
- 🟡 **Stub** — has API table + DB references from the doc, but needs requirements/design/tasks expanded (use the `spec-author` subagent)
- ⬜ **Empty** — folder exists, but no content yet

Run `/spec-status` to see the current state at any time.

## Don't put here

- Code samples beyond tiny pseudocode (real code goes in `backend/` or `frontend/`)
- Generated diagrams or screenshots
- Personal TODO lists (use `tasks.md` of the relevant spec, or the Claude TaskCreate tool)
