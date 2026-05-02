# Project Progress Tracker

## Current Status

**Phase 2 in progress** — Library page + body map complete. Remaining: category filter, GIF assets.

---

## Phase 1: Core Foundation 🏗️

- [x] Initialize Next.js 16 with PWA support (`@ducanh2912/next-pwa`)
- [x] Configure Tailwind v4 with modern luxury minimal design system (`app/globals.css`)
- [x] Setup PWA manifest (`public/manifest.json`)
- [x] Implement Mobile-only Guard — proxy + `/desktop-blocked` page
- [x] Setup Supabase browser + server clients (`core/supabase/`)
- [x] Configure IndexedDB with Dexie.js — full schema + types (`core/db/schema.ts`)
- [x] Build Sync Outbox worker — online listener + flush logic (`core/sync/outbox.ts`)
- [x] Setup TanStack Query provider + sync worker init (`components/providers.tsx`)
- [x] Scaffold module folder structure (`modules/workout`, `modules/routine`, `modules/library`)
- [x] Create Supabase schema — tables, indexes, RLS policies, `updated_at` trigger
- [x] Seed global exercise library (40 exercises across push/pull/legs/core/cardio)
- [x] Setup Supabase Auth — sign-in, sign-up pages, session proxy, email callback
- [x] ESLint + Prettier configured, `npm run gen:types` script added

---

## Phase 2: Exercise Library

- [x] Interactive SVG body map — front + back views, tap-to-select muscles (`react-body-highlighter`)
- [x] Per-muscle highlight in accent blue, fade transition on front/back toggle (`motion`)
- [x] Exercise Library page — `/library` route (`app/library/page.tsx`)
- [x] Search filter — real-time name search
- [x] Wire body map to exercise filter — tap muscle → exercises filter (OR logic)
- [x] Offline-capable exercise list — Dexie cache + TanStack Query (`staleTime: Infinity`)
- [x] GIF lazy-loading with skeleton fallback (`loading="lazy"` + animate-pulse)
- [ ] **[NEXT]** Category filter chips (push / pull / legs / core / cardio)
- [ ] Exercise detail sheet — instructions, full GIF view

---

## Phase 3: Workout Execution ⚡

- [ ] Zustand workout session store (`modules/workout/store.ts`)
- [ ] Build Active Workout Player — full-screen, distraction-free layout
- [ ] Rest timer with Vibration API haptic feedback
- [ ] Ghost PB display during active sets
- [ ] Set logging → Dexie → outbox → Supabase sync
- [ ] Error Boundary around Workout Player (crash must never lose in-progress data)
- [ ] GIF pre-fetching for all exercises in the active routine

---

## Phase 4: Sync & Polish ✨

- [ ] Background Sync — full retry logic + conflict resolution
- [ ] Routine Builder with drag-and-drop reordering
- [ ] Dashboard — muscle recovery body map + last session summary
- [ ] Performance audit — sustained 60fps on mid-range Android
- [ ] Lighthouse PWA audit — target score ≥ 90
- [ ] Finalize PWA icons — 192×192 and 512×512 PNG in `/public/icons/`
