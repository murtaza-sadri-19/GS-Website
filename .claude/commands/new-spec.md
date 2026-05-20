---
description: Scaffold a new spec folder with requirements/design/tasks templates
argument-hint: <spec-path> (e.g. 03-modules/labs, or features/new-thing)
---

You are scaffolding a new spec inside the `specs/` tree.

The user passed: `$ARGUMENTS`

1. Treat `$ARGUMENTS` as a path relative to `specs/`. If it is empty, ask the user where to put the spec and stop.
2. Create the folder `specs/$ARGUMENTS/` if it does not exist.
3. Copy each file from `specs/_template/` into it: `requirements.md`, `design.md`, `tasks.md`.
4. In each copied file, replace the placeholder `<spec-name>` with a humanized version of the last path segment.
5. Output the final paths and the next action: "Fill in requirements.md first; do not jump to design or tasks yet."

Do NOT generate detailed content for the new spec yet — only scaffold. Detailed content is written interactively with the user.
