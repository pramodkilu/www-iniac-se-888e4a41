# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**BLIX STEM Learning Platform** — An interactive bilingual (English/Swedish) education platform for 30 physical building projects across 9 school grades. Built with Lovable (AI-powered no-code builder) and deployed as a Vite + React SPA with Supabase as the backend.

## Commands

```bash
npm run dev        # Start dev server on http://localhost:8080
npm run build      # Production build
npm run lint       # ESLint check
npm run preview    # Preview production build locally
```

There are no test commands — this codebase has no test suite.

## Architecture

### Stack
- **React 18 + TypeScript + Vite** (SWC transpilation)
- **Supabase** — PostgreSQL database + authentication
- **shadcn-ui** (Radix UI primitives + Tailwind CSS)
- **React Router v6** — client-side routing
- **TanStack React Query v5** — server state
- **Three.js** — 3D visualizations
- **Tailwind CSS v3** with custom theme (slate-900 dark base, purple/cyan accents)

### Authentication & Role System
`src/hooks/useAuth.tsx` provides an `AuthProvider` context wrapping the entire app. It manages the Supabase session and fetches the user's role from the `user_roles` table. Four roles exist: `super_admin`, `admin`, `teacher`, `student`. Role-based route protection is enforced in `src/App.tsx`.

### Routing
Defined entirely in `src/App.tsx`. Public routes: `/`, `/auth`, `/chapter/:id`, `/education`, `/curriculum`, `/programs`, `/roboliga-register`. Protected, role-scoped routes: `/super-admin/*`, `/admin/*`, `/teacher/*`, `/student/*`. Each role has its own dashboard directory under `src/pages/dashboards/`.

### Curriculum Data
`src/data/chapters.ts` is the canonical source for all 30 STEM lessons. Each chapter has bilingual (`en`/`sv`) content via the `BilingualString` interface, LGR22 Swedish curriculum strand alignment, UN SDG mappings, and four content sections: Story, Theory, Build, and Challenge. `src/data/curriculumSessions.ts` and `src/data/blixSessions.ts` hold session metadata.

### Internationalization
A lightweight English/Swedish context lives in `src/i18n/LanguageContext.tsx`. No i18next — just a React Context with localStorage persistence. The `BilingualString` type (`{ en: string; sv: string }`) is used throughout data files.

### Path Aliases
`@/*` maps to `src/*` (configured in `vite.config.ts` and `tsconfig.app.json`). Use `@/components/...`, `@/hooks/...`, etc.

### Database
Supabase tables: `profiles`, `user_roles`, `chapter_progress`, `completed_chapters`. TypeScript types are auto-generated in `src/integrations/supabase/types.ts` — regenerate via Supabase CLI when schema changes. The client is initialized in `src/integrations/supabase/client.ts` using env vars `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

### TypeScript Configuration
The project uses relaxed TypeScript settings (`noUnusedLocals: false`, `noImplicitAny: false` in `tsconfig.app.json`). Don't tighten these without coordinating a broader cleanup.

### Key Large Components
- `src/components/ChapterWheel.tsx` — interactive radial chapter selector
- `src/components/FrictionSimulator.tsx` — physics simulation (28KB)
- `src/components/ThreeDGallery.tsx` — Three.js 3D model viewer
- `src/components/DashboardLayout.tsx` — shared sidebar/topbar shell for all dashboards
