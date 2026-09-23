# Contributing to Simple UI

> Spec-first: `docs/spec/README.md` is the index.
> Adding a component → `docs/spec/04-component-workflow.md` (canonical).
> Design rules → `docs/spec/01-design-principles.md`. Gates → `docs/spec/06-testing.md`.

## Adding a component

Follow every step — each one is enforced by tests or the build, so a missed
step fails loudly instead of shipping silently.

1. **Scaffold `src/components/<dir>/`** with exactly these files:
   - `<Pascal>.vue` — the component. `defineOptions({ name })`, `s-`-prefixed
     classes only, no app imports, no icon libraries, no date libraries.
   - `index.ts` — `export { S<Name> }` plus a default export.
   - `meta.json` — display `name`, `tag`, `category`, `description`, `props`,
     `events`, `slots`, `example`. Feeds docs, registry, llms.txt and MCP.
2. **Name it so Vue resolves it.** The export name must equal the tag
   camelized: tag `s-date-picker` → export `SDatePicker`. Names with adjacent
   capitals (`SCTA`, `STOC`) never resolve — write `SCta`, `SToc`.
   (`tests/registry.spec.ts` enforces this.)
3. **Export it from `src/components.ts`** (import + export list, alphabetical).
4. **Add it to `src/resolver.ts`** `COMPONENTS` (alphabetical).
5. **Add a docs example** at `docs/examples/<dir>.vue` importing from
   `@kundancool/simple-ui` (the built package — never `../../src`).
   (`tests/registry.spec.ts` requires the file to exist.)
6. **Add behavior tests** in `tests/` — mount it, click it, assert emits and
   visible state. Uncontrolled interaction (no `v-model` listener) must work
   for selection state.
7. **Use it somewhere real** — a demo page, the landing page, or another
   component. Unused components rot; reviewers will ask where it lives.
8. **Run the gates**: `npm test` (imports, registry, behavior),
   `npm run build` (lib + registry), `npm run build:docs` (demos compile).
9. **Docs IA**: nothing extra needed — sidebar, palette, breadcrumbs, llms.txt
   and MCP pick the component up from `meta.json` automatically. Only add a
   demo page if the component deserves a full-page story.

## Design contract (`DESIGN.md` is normative)

- Tokens only: `var(--s-*)`, never hex (fixed fills in toasts/knobs/scrims are the documented exceptions).
- Shared control-height contract for inputs, selects, date triggers and md buttons (xs 28 / sm 32 / md 36 / lg 40 — identical at the same size).
- Full contract: `docs/spec/01-design-principles.md` (§Control height contract, §Class hygiene) — same height at the same size, `box-sizing` guaranteed, only required classes, theme-consistent names.
- Every variant carries the same 1px border (transparent on fills) so sizes match under any box-sizing.
- Teleported popovers must carry `data-overlay` (the dialog focus trap looks for it).
- Overlay levels via `var(--s-z-*)`, never literals.
- Selection state works uncontrolled (Accordion/Carousel/Lightbox pattern); binary controls stay `v-model`-driven.
- Keyboard parity: arrows/Home/End wherever lists, tabs or ratings move; Escape closes overlays.
- Focus: fields ring border + subtle halo, buttons use `s-focus-ring` on `:focus-visible` only; icon-only buttons are `inline-flex` centered.
- Never shadow JS globals with imports (the Lucide `Map` icon broke `new Map()` in production — alias it).
- Single root element per page/component inside `<Transition>`; pages keep one root `<div>`.
- No Element Plus / heroicons / dayjs imports — inline SVGs, native `Date`.
