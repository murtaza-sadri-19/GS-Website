# Public Pages

Routes mounted via `<PublicRoutes>` wrapping `PublicLayout` (navbar + footer). All routes are open — no auth.

| Page | Route | Purpose |
| --- | --- | --- |
| Home | `/` | Hero, latest 5 notices, upcoming events, gallery preview, quick links |
| About | `/about` | College intro (from `pages` table, slug=about) |
| Administration | `/administration` | Administration content (from `pages`, slug=administration) |
| Departments | `/departments` | All ACTIVE departments grid |
| Department Detail | `/departments/:slug` | Profile + faculty + recent notices + downloads + gallery |
| Faculty Profile | `/faculty/:id` | Public teacher profile |
| Examination | `/examination` | All exam_documents grouped by document_type |
| Training and Placement | `/training-placement` | placement_records grouped by record_type |
| Notices | `/notices` | All PUBLISHED notices, filterable by type |
| Notice Detail | `/notices/:slug` | Single notice |
| Downloads | `/downloads` | All ACTIVE downloads, filterable by category + dept |
| Events | `/events` | All PUBLISHED events |
| Event Detail | `/events/:slug` | Single event |
| Gallery | `/gallery` | Image grid, filterable by dept |
| Contact | `/contact` | Contact info + Google Maps embed (from `pages`, slug=contact) |
| Login | `/login` | Staff login form |

## Data fetching

All public APIs return only ACTIVE/PUBLISHED records (backend enforced). Frontend doesn't filter on status.

## Public data → backend table mapping

| Public Section | Backend Table |
| --- | --- |
| Latest Notices | `notices` |
| Departments | `departments` |
| Faculty | `faculty_profiles` |
| Examination | `exam_documents` |
| Training and Placement | `placement_records` |
| Events | `events` |
| Gallery | `gallery` |
| Downloads | `downloads` |
| Dynamic Pages (About/Administration/Contact) | `pages` |

## Layout

`<PublicLayout>`:
- Top: logo + nav (Home, About, Departments, Examination, Training & Placement, Notices, Downloads, Events, Gallery, Contact, Login)
- Body: `<Outlet />`
- Footer: address, copyright, social links, important links

## Responsiveness

Test breakpoints at 360px (small mobile), 768px (tablet), 1024px (laptop), 1440px (desktop). Hamburger nav below 1024px.

## SEO

- Set `<title>` per page (e.g. "Notices — College Name")
- `<meta name="description">` per page; from `pages.meta_description` for dynamic pages
- Slug-based URLs for shareability
