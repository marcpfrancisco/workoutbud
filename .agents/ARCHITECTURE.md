# Technical Architecture: WorkoutBud (Hologram Edition)

## 1. Tech Stack

| Layer | Package | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router) | RSC-first, no Pages Router |
| Runtime | React 19 | Server Components by default |
| Language | TypeScript 5 (strict) | Zero `any` policy |
| Styling | Tailwind CSS 4 | CSS-first config via `@theme` in globals.css |
| Component Animation | `motion` v12 | Formerly Framer Motion — import from `motion/react` |
| Timeline Animation | GSAP 3 | SVG sequences, multi-element timelines |
| Auth / Database | Supabase (PostgreSQL + RLS) | Auth, storage, real-time |
| Global State | Zustand 5 | Session state only |
| Server Cache | TanStack Query 5 | Supabase data in Client Components |
| Offline DB | Dexie 4 (IndexedDB) | Primary write store |
| PWA | `@ducanh2912/next-pwa` 10 | Service worker + caching strategy |
| Validation | Zod 4 | All system boundaries |
| Target Platform | Mobile-only PWA | Desktop blocked via middleware in production |

---

## 2. Folder Structure

```
workoutbud/
├── app/                        ← Routing only
│   ├── layout.tsx
│   ├── page.tsx
│   └── desktop-blocked/
├── modules/
│   ├── workout/                ← Session tracking, timers, set logging
│   ├── routine/                ← Planner, drag-and-drop, volume logic
│   └── library/                ← Exercise catalog, SVG body map
├── core/
│   ├── supabase/
│   │   ├── client.ts           ← Browser client (Client Components)
│   │   └── server.ts           ← RSC / Server Action client
│   ├── db/
│   │   └── schema.ts           ← Dexie DB class + all type exports
│   └── sync/
│       └── outbox.ts           ← Online listener + outbox flush logic
├── components/
│   └── providers.tsx           ← QueryClient + sync worker
├── middleware.ts               ← Mobile UA guard (prod only)
└── public/
    ├── manifest.json
    └── icons/
```

---

## 3. Offline-First Data Flow

```
User Action
    │
    ▼
Zustand Store ── optimistic UI update (instant)
    │
    ▼
Dexie IndexedDB ── immediate persist (no network wait)
    │
    ▼
Sync Outbox (queued operation record)
    │
    ├── offline ──→ stays in queue until online
    │
    └── online ───→ flush to Supabase
                        │
                   success → delete from outbox
                   failure → retries++, log to syncErrors
```

---

## 4. Authentication Flow

1. Supabase Auth manages the session via HTTP-only cookies (SSR-compatible).
2. `core/supabase/server.ts` reads cookies in RSC and middleware to protect server routes.
3. `core/supabase/client.ts` manages session tokens in Client Components.
4. All tables enforce `auth.uid() = user_id` RLS — unauthenticated queries return empty results, not errors.
5. On sign-out, Zustand clears session state and the sync outbox is discarded.

---

## 5. Supabase Schema

### `exercises`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | `gen_random_uuid()` |
| `name` | `text` | |
| `muscle_groups` | `text[]` | Array of SVG muscle IDs |
| `category` | `text` | `push` / `pull` / `legs` / `core` |
| `gif_url` | `text` | nullable |
| `instructions` | `text` | nullable |
| `is_global` | `boolean` | Global library vs user-created |
| `user_id` | `uuid` | null for global exercises |
| `created_at` | `timestamptz` | |

### `routines`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `user_id` | `uuid` | FK → `auth.users` |
| `name` | `text` | |
| `exercises` | `jsonb` | `RoutineExercise[]` |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

### `workout_logs`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `user_id` | `uuid` | FK → `auth.users` |
| `routine_id` | `uuid` | FK → `routines` |
| `started_at` | `timestamptz` | |
| `completed_at` | `timestamptz` | nullable |
| `sets` | `jsonb` | `SetLog[]` |

### RLS Policy Pattern (applies to all tables)
```sql
-- Read
CREATE POLICY "own_data_select" ON table_name
  FOR SELECT USING (auth.uid() = user_id);

-- Write
CREATE POLICY "own_data_insert" ON table_name
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update
CREATE POLICY "own_data_update" ON table_name
  FOR UPDATE USING (auth.uid() = user_id);

-- Delete
CREATE POLICY "own_data_delete" ON table_name
  FOR DELETE USING (auth.uid() = user_id);
```

---

## 6. State Management Decision Tree

```
Data from Supabase?
  └── YES → TanStack Query (useQuery / useMutation)
             Writes also enqueue to Dexie outbox

Active workout session state? (current set, timer countdown, reps in-progress)
  └── YES → Zustand store (modules/{domain}/store.ts)

Ephemeral UI state? (modal open, selected tab, accordion expanded)
  └── YES → useState — no store, no query
```

---

## 7. Server Actions vs Route Handlers

| Scenario | Use |
|---|---|
| Form submissions from Client Components | Server Action |
| Mutations triggered from RSC | Server Action |
| Webhook receivers (third-party) | Route Handler |
| Proxying external APIs | Route Handler |

Standard CRUD against Supabase does not use Route Handlers — call Supabase directly from Client Components (via TanStack Query) or Server Actions.

---

## 8. Animation Architecture

### `motion` handles:
- Component entrance / exit
- Layout transitions
- Interactive feedback (tap, press, swipe)
- Per-muscle SVG pulse highlights

### GSAP handles:
- Multi-element sequenced timelines
- SVG path draw animations (body map reveal)
- Scroll-triggered effects
- Stagger chains across many elements

One animation owner per DOM element — never mix both on the same target.

---

## 9. Performance Budget

| Metric | Target |
|---|---|
| Lighthouse Performance (mobile) | ≥ 90 |
| First Contentful Paint | < 1.5s on 4G |
| Animation frame rate | 60fps sustained |
| Time to Interactive | < 3s on mid-range Android |
| Offline boot (from SW cache) | < 500ms |

Only animate `transform` and `opacity` — compositor-only. Never animate layout properties.

---

## 10. Security

- RLS active on every table — `auth.uid() = user_id` is mandatory
- Zod validates all form inputs and Server Action arguments before any DB operation
- Service role key is server-only — never in `NEXT_PUBLIC_` env vars
- Middleware blocks non-mobile User-Agents in production
- Only `NEXT_PUBLIC_` prefix for client-safe environment values
