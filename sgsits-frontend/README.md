# Frontend — SGSITS College Website

React + TypeScript single-page application for the SGSITS dynamic college website.

## Stack

| Concern          | Library / Tool                          |
| ---------------- | --------------------------------------- |
| Framework        | React 19 + TypeScript                   |
| Build tool       | Vite 8                                  |
| Routing          | React Router v7                         |
| Styling          | Tailwind CSS v4                         |
| Server state     | TanStack React Query v5                 |
| Client state     | Zustand                                 |
| HTTP client      | Axios                                   |
| Icons            | Lucide React                            |

## Prerequisites

- Node.js ≥ 18
- Backend API running (see `../backend/README.md`)

## Setup

```bash
cd sgsits-frontend
npm install
```

Create a `.env` file in this folder:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## Running

```bash
# Development server (hot-reload)
npm run dev

# Type-check + production build
npm run build

# Preview the production build locally
npm run preview
```

The dev server starts on `http://localhost:5173` by default.

## Project structure

```
sgsits-frontend/
├── index.html
├── public/
│   ├── assets/          # Static images and campus media
│   └── svgs/            # SVG illustrations
└── src/
    ├── main.tsx         # App entry, React root mount
    ├── App.tsx          # Root component, router setup
    ├── api/
    │   ├── client.ts    # Axios instance (base URL, auth header injection)
    │   └── index.ts     # Typed API call wrappers per module
    ├── routes/          # Route definitions and protected route wrappers
    ├── pages/           # One folder / file per page (public + dashboard)
    ├── components/      # Shared UI components (buttons, modals, tables, etc.)
    ├── cms/             # CMS content config by section (about, accreditation, etc.)
    ├── hooks/           # Custom React hooks (data fetching, auth, etc.)
    ├── services/        # Non-React business logic / API service helpers
    ├── store/           # Zustand stores (auth, UI state)
    ├── types/           # TypeScript interfaces and enums
    ├── utils/           # Pure utility functions
    ├── constants/       # App-wide constants and enums
    ├── data/            # Static/mock data used in development
    └── mock/            # Mock API handlers for offline development
```

## Authentication

- On login, the JWT is stored client-side and attached to every API request via the Axios instance.
- Protected routes check the auth store; unauthenticated users are redirected to `/login`.
- Logout removes the token from the store — there is no server-side session.

## Role-based UI

The frontend conditionally renders dashboard links and action buttons based on the logged-in user's role (`CENTRAL_ADMIN`, `EXAM_CONTROLLER`, `PLACEMENT_OFFICER`, `HOD`, `TEACHER`). This is UX only — all permission enforcement happens on the backend.

## Linting

```bash
npm run lint
```

ESLint is configured with `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`.
