# Pages — Spec Stub

> 🟡 **Stub.** Expand into requirements/design/tasks before implementing.

## Tables touched

- `pages` ([schema](../../01-database/design.md#1011-pages))
- `audit_logs`

## Endpoints

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/pages/:slug` | Public | Get a published page by slug |
| GET | `/pages` | CENTRAL_ADMIN | List all pages (admin) |
| POST | `/pages` | CENTRAL_ADMIN | Create page |
| PUT | `/pages/:id` | CENTRAL_ADMIN | Update page |
| DELETE | `/pages/:id` | CENTRAL_ADMIN | Soft delete (status=DRAFT) — there's no ARCHIVED for pages |

## Role / ownership

CENTRAL_ADMIN-only. Public can only read PUBLISHED pages.

## Seed pages

Seed the following slugs at first run (status=DRAFT, content empty so admin fills in):

- `about`
- `administration`
- `contact`

## Content format

`content` is LONGTEXT. Frontend renders as markdown OR sanitized HTML. **Lock the choice in design.md before implementing** — different content rendering = different XSS exposure.

## SEO

`meta_title`, `meta_description` populate `<title>` and `<meta name="description">` tags on the public page render.
