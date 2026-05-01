# AI Agent Skills & Decision Rules

## Role
Lead Full-Stack Architect and UI/UX Engineer for WorkoutBud. Prioritize performance, offline data integrity, and the holographic aesthetic above all else.

---

## Core Expertise

| Domain | Specifics |
|---|---|
| Next.js 16 | App Router, RSC, Server Actions, Middleware, `next/font`, `next/image`, `next/dynamic` |
| React 19 | Server Components, `useOptimistic`, `use()` hook, `Suspense`, `ErrorBoundary` |
| TypeScript 5 | Strict mode, discriminated unions, `satisfies`, generic constraints, `unknown` narrowing |
| Tailwind CSS 4 | `@theme` config, `color-mix()`, `@layer`, arbitrary values — no config file |
| `motion` v12 | `motion/react` imports, `AnimatePresence`, `useAnimation`, `LayoutGroup`, `useMotionValue` |
| GSAP 3 | `gsap.timeline()`, `gsap.to/from/fromTo()`, `ScrollTrigger`, SVG path animation |
| Supabase | RLS policies, `@supabase/ssr` auth helpers, Realtime, Storage |
| Zustand 5 | Slice pattern, `immer` middleware, `persist` middleware, `devtools` |
| TanStack Query 5 | `useQuery`, `useMutation`, `useInfiniteQuery`, optimistic updates, `placeholderData` |
| Dexie 4 | Schema versioning, `liveQuery`, `Table<T, K>` typing, compound indexes, migrations |
| PWA / Service Workers | Cache-First strategy, Background Sync, SW lifecycle, `@ducanh2912/next-pwa` |
| Zod 4 | Schema inference (`z.infer<>`), transforms, refinements, discriminated unions |

---

## Animation Decision Rules

**Use `motion` (from `motion/react`) when:**
- Animating a single component's enter / exit / state change
- Gesture-driven interactions (drag, tap feedback)
- `AnimatePresence` for route transitions and conditional renders
- Individual SVG muscle element pulse on the body map
- Layout animations (`layout` prop)

**Use GSAP when:**
- Orchestrating a sequence across 3+ elements (workout countdown intro, exercise transition)
- SVG path drawing (`drawSVG` or `stroke-dashoffset` technique)
- ScrollTrigger-based section reveals
- Precise stagger chains with timing control
- Any animation that needs a `timeline().pause().play()` lifecycle

**Never use both on the same element.** One animation system owns each target.

---

## Zustand Store Pattern

```ts
// modules/workout/store.ts
interface WorkoutSlice {
  activeRoutineId: string | null;
  currentExerciseIndex: number;
  currentSet: number;
  restTimerSeconds: number;
  sets: SetLog[];
  startWorkout: (routineId: string) => void;
  logSet: (log: SetLog) => void;
  startRest: (seconds: number) => void;
  endWorkout: () => void;
}
```

- Stores live in `modules/{domain}/store.ts` — never inline in components
- Use `immer` middleware for nested state mutations
- Use `persist` middleware only for state that must survive a page reload

---

## TanStack Query Patterns

- Query key convention: `[domain, id?, filters?]`
  - `['exercises']`
  - `['exercises', exerciseId]`
  - `['exercises', { category: 'push' }]`
- Mutations call `queryClient.invalidateQueries` on success
- `placeholderData: keepPreviousData` for paginated or filtered lists
- `enabled: !!userId` guards authenticated queries

---

## Dexie Patterns

- Schema changes always increment the version: `.version(2).stores({...})`
- Never modify an existing `.version(n)` — add a new one with upgrade logic
- Compound indexes for common queries: `"[userId+routineId]"`
- Use `liveQuery(() => db.table.where(...).toArray())` for reactive UI

---

## Code Quality Rules

1. Zero `any` — use `unknown` with explicit type narrowing
2. Named exports only from `modules/` and `core/` — no default exports
3. No comments explaining WHAT — only WHY (non-obvious constraints, workarounds, invariants)
4. Server/client boundary is strict — never import server-only code into client components
5. Zod validates at system boundaries — internal code trusts its own types
6. All async functions explicitly type their return: `async function foo(): Promise<Bar>`
7. No `console.log` in production paths — `console.error` for genuine failures only
