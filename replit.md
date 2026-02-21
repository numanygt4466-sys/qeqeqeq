# RAW ARCHIVES — White-Label Record Label / Distribution Platform

## Overview

RAW ARCHIVES is a full-stack white-label music record label and distribution platform dashboard, inspired by Universal Music Group's web presence. It combines a public-facing marketing website (artist roster, catalog, submissions) with a protected SaaS dashboard for managing releases, earnings, artists, and support tickets.

The platform supports role-based access control (admin, label_manager, artist) with an application/approval workflow — new users register, submit an application, and must be approved by an admin before accessing the dashboard. The admin can manage users, approve/reject releases, handle support tickets, and oversee the entire platform.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Monorepo Structure
The project uses a single repository with three main directories:
- **`client/`** — React frontend (Vite + TypeScript)
- **`server/`** — Express.js backend (TypeScript, compiled with tsx/esbuild)
- **`shared/`** — Shared schema definitions and types used by both client and server

### Frontend (`client/src/`)
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: `wouter` (lightweight client-side router)
- **State/Data**: TanStack React Query for server state management
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives
- **Styling**: Tailwind CSS v4 with CSS variables for theming; dark mode is the default (class `dark` on `<html>`)
- **Fonts**: Inter (Google Fonts)
- **Animations**: Framer Motion for page transitions and UI effects
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

**Key pages:**
- Public: Home (`/`), Artists (`/artists`), Catalog (`/catalog`), Submissions (`/submissions`), Login (`/login`), Register (`/register`)
- Protected (`/app/*`): Dashboard, Catalog, Upload, Earnings, Payouts, Artists, Settings, Support
- Admin (`/app/admin/*`): Applications, Releases queue, User management, Support tickets
- Pending approval page shown to unapproved users

**Auth flow**: `useAuth` hook provides context with login/register/logout mutations. `RequireAuth` wrapper redirects unauthenticated users to `/login`. Unapproved users see a `PendingApproval` page.

### Backend (`server/`)
- **Framework**: Express.js with TypeScript (runs via `tsx` in dev, esbuild bundle in prod)
- **Session management**: `express-session` with `connect-pg-simple` for PostgreSQL-backed sessions
- **Authentication**: Custom session-based auth with bcryptjs password hashing. No Passport.js currently (though it's in dependencies).
- **Middleware**: `requireAuth`, `requireApproved`, `requireAdmin` guards for route protection
- **API pattern**: REST endpoints under `/api/` prefix. JSON request/response.
- **Build**: Custom build script (`script/build.ts`) uses esbuild for server and Vite for client. Production output goes to `dist/`.

**Key files:**
- `server/routes.ts` — All API route definitions with auth middleware
- `server/storage.ts` — Data access layer (IStorage interface) using Drizzle ORM
- `server/seed.ts` — Database seeding script (creates admin user: `admin` / `123`)
- `server/vite.ts` — Vite dev server middleware integration
- `server/static.ts` — Serves built client files in production

### Database
- **Database**: PostgreSQL (required, via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema validation
- **Schema location**: `shared/schema.ts`
- **Migrations**: Drizzle Kit (`drizzle-kit push` for development, migrations output to `./migrations/`)

**Tables:**
- `users` — id, username, email, password (hashed), fullName, labelName, role (admin/label_manager/artist), isApproved, country, timezone, createdAt
- `applications` — id, userId (FK→users), status, rejectionReason, createdAt, reviewedAt
- `releases` — id, userId (FK→users), title, version, primaryArtist, releaseType, genre, language, releaseDate, status, rejectionReason, coverArtUrl, dsps (text array), createdAt
- `tracks` — id, releaseId (FK→releases), title, trackNumber, plus additional fields
- `tickets` — id, userId (FK→users), subject, plus status/timestamp fields
- `ticketMessages` — id, ticketId (FK→tickets), userId (FK→users), message, plus timestamp

### Role-Based Access Control
- **admin**: Full platform access — approve/reject applications and releases, manage users, view all tickets
- **label_manager**: Submit releases, manage artists within their label
- **artist**: View own releases and earnings only
- New accounts require admin approval before dashboard access is granted

### Dev vs Production
- **Development**: `npm run dev` starts Express with Vite middleware for HMR on port 5000
- **Production**: `npm run build` compiles client (Vite) and server (esbuild) into `dist/`, then `npm start` serves the bundled app

## External Dependencies

### Required Services
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable. Used for both data storage and session storage (`connect-pg-simple`).

### Key NPM Packages
- **Drizzle ORM + drizzle-zod + drizzle-kit**: Database ORM, schema validation, and migration tooling
- **express-session + connect-pg-simple**: Server-side session management backed by PostgreSQL
- **bcryptjs**: Password hashing
- **@tanstack/react-query**: Client-side server state management and caching
- **wouter**: Lightweight client-side routing
- **shadcn/ui + Radix UI**: Component library (accordion, dialog, dropdown-menu, tabs, toast, tooltip, select, etc.)
- **Tailwind CSS + class-variance-authority + clsx + tailwind-merge**: Styling utilities
- **framer-motion**: Animation library
- **zod**: Runtime schema validation (shared between client and server)
- **recharts**: Charting library (for dashboard analytics)
- **react-day-picker**: Calendar/date picker component
- **embla-carousel-react**: Carousel component
- **vaul**: Drawer component
- **cmdk**: Command palette component
- **date-fns**: Date utility library

### Replit-Specific Integrations
- `@replit/vite-plugin-runtime-error-modal`: Runtime error overlay in development
- `@replit/vite-plugin-cartographer`: Development tooling (dev only)
- `@replit/vite-plugin-dev-banner`: Development banner (dev only)
- Custom `vite-plugin-meta-images`: Updates OpenGraph meta tags with correct deployment URLs