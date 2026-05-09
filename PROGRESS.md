# Project Progress Tracker

## Current Status

**Phase 3 complete. Phase 4 in progress.** Homepage UI refresh done (bold typography, stats strip, choreographed animations, accent-ring achievements, progress bar challenges). Next: Routine Builder + Background Sync.

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
- [x] Category filter chips (push / pull / legs / core / cardio)
- [x] Exercise detail sheet — bottom sheet with full GIF, muscle chips, instructions

---

## Phase 3: Workout Execution ⚡

- [x] Dashboard home screen — week strip, swipeable calendar, streak counter, daily challenges, achievements, quick-start card (`modules/dashboard/`)
- [x] Zustand workout session store (`modules/workout/store.ts`)
- [x] Build Active Workout Player — full-screen, distraction-free layout
- [x] Rest timer with Vibration API haptic feedback
- [x] Ghost PB display during active sets
- [x] Set logging → Dexie → outbox → Supabase sync
- [x] Error Boundary around Workout Player (crash must never lose in-progress data)
- [x] GIF pre-fetching for all exercises in the active routine

---

## Phase 3.5: UI Polish 🎨

- [x] Homepage refresh — bold `text-3xl` greeting, date + motivational subtitle
- [x] Stats strip — 3-column big-number card (streak 🔥, last sets, duration)
- [x] WeekStrip — filled accent circle for today, bolder streak pill, larger nav dots
- [x] QuickStart — accent left-border, 3-stat grid (min/sets/exercises), spring "Start Again"
- [x] Daily Challenges — animated progress bar, spring-pop checkmark (AnimatePresence)
- [x] Achievements — accent ring for unlocked, 🔒 icon + 45% opacity for locked
- [x] Choreographed entrance animations — greeting slides left, QuickStart slides right, WeekStrip scales up, achievements spring-pop
- [x] Homepage UI v2 — CSS keyframes (fire/float/ping-slow/shimmer), rounder radii (sm:10 md:16 lg:26), asymmetric streak hero tile, time-based decorative icon in greeting, shimmer progress bar, floating achievement icons with staggered delay, gradient QuickStart card with decorative 💪 bg
- [ ] Library page UI refresh
- [ ] Workout Player UI refresh

---

## Phase 4: Sync & Polish ✨

- [ ] Background Sync — full retry logic + conflict resolution
- [ ] Routine Builder with drag-and-drop reordering
- [ ] Dashboard — muscle recovery body map + last session summary
- [ ] Performance audit — sustained 60fps on mid-range Android
- [ ] Lighthouse PWA audit — target score ≥ 90
- [ ] Finalize PWA icons — 192×192 and 512×512 PNG in `/public/icons/`
