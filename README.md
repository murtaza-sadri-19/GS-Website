# Dynamic College Website

A multi-role college website: public site for visitors, role-based dashboards for staff.

## Stack
React + Express + MySQL + JWT + Multer/Cloudinary.

## Status
Setup phase. The codebase is being built spec-first — see [`specs/`](./specs/).

## How this project is organized

- **`specs/`** — source of truth. Every feature has `requirements.md`, `design.md`, `tasks.md`.
- **`.claude/`** — Claude Code configuration (custom slash commands, subagents).
- **`backend/`** — Express API (created during Phase 1).
- **`frontend/`** — React app (created during Phase 1).
- **`CLAUDE.md`** — project rules + non-negotiables Claude loads automatically.

## Where to start

1. Read [`specs/README.md`](./specs/README.md) to understand the spec workflow.
2. Read [`specs/00-foundation/`](./specs/00-foundation/) for the big picture.
3. Follow the build order in [`specs/05-roadmap/phases.md`](./specs/05-roadmap/phases.md).

## Working with Claude Code

From inside this folder, use:

| Command | What it does |
| --- | --- |
| `/new-spec <path>` | Scaffold a new spec folder from the template |
| `/spec-status` | Show which specs are filled in vs stubs |
| `/review-spec <path>` | Audit a spec for completeness |
| `/implement-spec <path>` | Build code strictly from a finished spec |

The `spec-author` subagent can expand a stub module spec into the full requirements/design/tasks trio.


