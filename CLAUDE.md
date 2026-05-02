# Claude AI Agent Guidelines: WorkoutBud

> Authoritative source of truth for any AI agent on this project.
> Read completely before writing any code or making architectural decisions.

---

## ⚠️ Framework Awareness

This project runs **Next.js 16** with **React 19**. APIs, file conventions, and component behavior differ significantly from older versions in your training data. Before implementing any Next.js feature, verify the API in `node_modules/next/dist/docs/`. Never assume `getServerSideProps`, `getStaticProps`, or Pages Router patterns apply here.

---

## 1. Project Identity

**WorkoutBud** is a mobile-only, offline-first PWA for elite athletes who train in environments where connectivity is a luxury and data precision is a necessity.

It is **not** a social platform, calorie tracker, or beginner fitness app.
It **is** a precision workout logger, an offline data engine, and a holographic body visualization tool.

---

## 2. Exact Tech Stack

| Layer               | Package                                   | Version      |
| ------------------- | ----------------------------------------- | ------------ |
| Framework           | `next`                                    | 16.x         |
| Runtime             | `react` / `react-dom`                     | 19.x         |
| Language            | `typescript`                              | 5.x (strict) |
| Styling             | `tailwindcss`                             | 4.x          |
| Component Animation | `motion`                                  | 12.x         |
| Timeline Animation  | `gsap`                                    | 3.x          |
| Database / Auth     | `@supabase/supabase-js` + `@supabase/ssr` | latest       |
| Global State        | `zustand`                                 | 5.x          |
| Server Cache        | `@tanstack/react-query`                   | 5.x          |
| Offline DB          | `dexie`                                   | 4.x          |
| PWA                 | `@ducanh2912/next-pwa`                    | 10.x         |
| Validation          | `zod`                                     | 4.x          |

**Critical naming rules:**

- `motion` was rebranded from `framer-motion`. Import as `import { motion } from "motion/react"`. Never suggest installing or importing `framer-motion`.
- Use `@ducanh2912/next-pwa` only. The original `next-pwa` package is abandoned for Next.js 14+.
- Never suggest installing a package — the user runs all `npm install` commands themselves. Flag what is needed, do not run it.

---

## 3. Folder Structure

```
workoutbud/
├── app/                        ← Next.js App Router (routing ONLY)
│   ├── layout.tsx              ← Root layout + Providers wrapper
│   ├── page.tsx                ← Entry/splash
│   └── desktop-blocked/        ← Desktop redirect target
├── modules/
│   ├── workout/                ← Active session, set logging, rest timers
│   ├── routine/                ← Planner, drag-and-drop, volume logic
│   └── library/                ← Exercise catalog, SVG body map
├── core/
│   ├── supabase/
│   │   ├── client.ts           ← Browser Supabase client
│   │   └── server.ts           ← RSC / Server Action Supabase client
│   ├── db/
│   │   └── schema.ts           ← Dexie DB class + all exported types
│   └── sync/
│       └── outbox.ts           ← Online listener + outbox flush
├── components/                 ← Shared UI primitives only
│   └── providers.tsx           ← QueryClient + sync worker init
├── middleware.ts               ← Mobile UA guard (production only)
├── .env.local                  ← Supabase keys — never commit
└── public/
    ├── manifest.json
    └── icons/                  ← 192x192 and 512x512 PNG required
```

**Rule:** `app/` is for routing only. Business logic, hooks, stores, and data fetching all live in `modules/` or `core/`. Never put store logic or data-fetching hooks directly inside `app/`.

---

## 4. TypeScript Standards

- **Strict mode is on.** Zero tolerance for `any`. Use `unknown` with type guards.
- Prefer `interface` for object shapes. Use `type` for unions and intersections only.
- Export types explicitly: `export type { Foo }` not `export { Foo }`.
- All Supabase results must destructure `{ data, error }` — check `error` before using `data`.
- No implicit `any` from untyped third-party calls — cast explicitly with justification.

---

## 5. Component Rules

**RSC by default.** Only add `"use client"` when the component needs:

- `useState` / `useEffect` / `useRef`
- Browser APIs (`navigator.onLine`, Vibration API, IndexedDB)
- Event listeners or interactive handlers
- `motion` animations

One file = one component. No barrel files exporting 10+ things.

**Naming:** PascalCase for components, camelCase for hooks/utilities/stores.

**Props:** Type explicitly inline. Never use `React.FC<>` — just `({ prop }: { prop: Type })`.

---

## 6. Styling & Design System

### Tailwind v4 — CSS-first configuration

No `tailwind.config.js`. All design tokens live in `app/globals.css` inside `@theme {}`.

### Design Direction

**Modern luxury minimal.** Clean, precise, confident. No glows, no neon, no holographic effects.
Think: Vercel, Linear, high-end athletic hardware. Typography and whitespace do the work.

### Color Tokens

| CSS Variable              | Hex / Value                  | Tailwind Class                     |
| ------------------------- | ---------------------------- | ---------------------------------- |
| `--color-canvas`          | `#0C0C0C`                    | `bg-canvas`                        |
| `--color-surface`         | `#161616`                    | `bg-surface`                       |
| `--color-surface-raised`  | `#202020`                    | `bg-surface-raised`                |
| `--color-surface-overlay` | `#2B2B2B`                    | `bg-surface-overlay`               |
| `--color-primary`         | `#F0F0F0`                    | `text-primary`                     |
| `--color-secondary`       | `#888888`                    | `text-secondary`                   |
| `--color-tertiary`        | `#444444`                    | `text-tertiary`                    |
| `--color-accent`          | `#5A9EF8`                    | `text-accent`, `bg-accent`         |
| `--color-accent-dim`      | `#1A2A3F`                    | `bg-accent-dim`                    |
| `--color-error`           | `#F87171`                    | `text-error`                       |
| `--color-success`         | `#4ADE80`                    | `text-success`                     |

### Radii

| Token          | Value  |
| -------------- | ------ |
| `--radius-sm`  | `8px`  |
| `--radius-md`  | `12px` |
| `--radius-lg`  | `18px` |

### Component Utilities (defined in globals.css)

- `.card` — surface background + 7% white border + `--radius-md`
- `.card-raised` — elevated card on `--color-surface-raised`
- `.field` — dark input well, brightens border on focus (no glow)
- `.btn` — solid accent fill, white text, `--radius-sm`

### Rules

- Always dark mode. No light/dark toggle. `color-scheme: dark` is global.
- Never hardcode hex values in components. Always use design tokens.
- Never use inline styles unless GSAP requires it for animation targets.

---

## 7. Animation Rules

### Use `motion` (from `motion/react`) for:

- Component entrance / exit animations
- Layout transitions between states
- Interactive element feedback (button press, set logged)
- Per-muscle SVG highlight pulses

### Use `GSAP` for:

- Multi-element sequenced timelines (workout intros, exercise transitions)
- SVG path draw animations (body map reveals)
- Scroll-triggered effects
- Any animation requiring precise stagger/delay control

**Never use both on the same element.** One animation owner per target.

### Performance

- **60fps is the floor.** Test on a mid-range Android device.
- Only animate `transform` and `opacity` — compositor-only properties.
- Never animate `width`, `height`, `top`, `left`, or any layout property.
- Wrap complex animations with `prefers-reduced-motion` checks.

### Haptics (Vibration API)

Fire only on three events:

1. Rest timer reaches zero
2. New personal best logged
3. Workout session completed

No other vibration triggers.

---

## 8. State Management

### Decision tree

```
Is this data from Supabase?
  YES → TanStack Query (useQuery / useMutation)
        Writes also enqueue to Dexie outbox

Is this active session state? (current set, timer, in-progress reps)
  YES → Zustand store (modules/{domain}/store.ts)

Is this ephemeral UI state? (modal open, active tab)
  YES → useState (local, no store needed)
```

### Zustand

- One store per module domain: `modules/workout/store.ts`, `modules/routine/store.ts`
- Use slice pattern — never put unrelated state in one store
- Use `immer` middleware for complex nested updates

### TanStack Query

- Query key convention: `[domain, id?, filters?]` e.g. `['exercises', { category: 'push' }]`
- Always invalidate related keys after mutations
- Use `enabled: !!userId` to guard authenticated queries

### Dexie

- Schema changes must increment version number — never mutate an existing `.version(n)`
- Use `liveQuery()` for reactive UI that reflects IndexedDB changes in real time

---

## 9. Offline-First Rules

- **Every write goes to Dexie first.** Never write directly to Supabase from the workout player.
- UI is always optimistic — never block the user on a network response.
- Sync failures are written to the `syncErrors` Dexie table — never silently dropped.
- Every image/GIF uses `loading="lazy"` and has a skeleton fallback state.
- Service worker is fully managed by `@ducanh2912/next-pwa` — never manually edit the generated SW files.

**Data flow:**

```
User action → Zustand (optimistic) → Dexie (persist) → Outbox → Supabase
```

---

## 10. Supabase Patterns

| Context                           | Import from               |
| --------------------------------- | ------------------------- |
| Client Components, hooks          | `core/supabase/client.ts` |
| Server Components, Server Actions | `core/supabase/server.ts` |

Always check errors:

```ts
const { data, error } = await supabase.from("table").select();
if (error) throw new Error(error.message);
```

RLS is always active. Every table enforces `auth.uid() = user_id`. Never disable RLS. Never expose the service role key on the client.

All form and API input passes through a `zod` schema before touching Supabase or Dexie.

---

## 11. Error Handling

- **Error Boundaries** wrap the Workout Player — a render crash must never lose in-progress set data.
- Server Actions and Route Handlers return `{ data, error }` result objects — never `throw` across the network boundary.
- `console.error` only for genuine errors. No `console.log` in production paths.
- Sync errors → `syncErrors` table in Dexie (surfaceable to the user for debugging).

---

## 12. PWA Compliance Checklist

Before any feature is considered complete:

- [ ] Works with `navigator.onLine === false`
- [ ] New images have `loading="lazy"` and a skeleton fallback
- [ ] New icons added to `/public/icons/` and registered in `manifest.json`
- [ ] No network calls that block the UI when offline

---

## 13. What NOT To Do

- Do not add features outside the current Phase without asking
- Do not run `npm install` — flag the package needed and let the user install
- Do not use the Pages Router (`pages/` directory) — App Router only
- Do not import from `framer-motion` — use `motion/react`
- Do not write directly to Supabase from the workout player — always use the outbox
- Do not add comments explaining WHAT the code does — only WHY for non-obvious constraints
- Do not create files outside the established folder structure without discussion
- Do not use `any` — ever
- Do not add light mode support
- Do not add social, sharing, gamification, or calorie features
