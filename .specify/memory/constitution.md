# Simple UI Constitution

Version 1.0.0 — ratified 2026-09-23. Supreme over `docs/spec/`, which holds
the normative details. When they disagree, this document wins and the spec
must be updated in the same change.

## Core Principles

### I. Layout Neutrality (GODLY RULE, NON-NEGOTIABLE)

A component MUST NOT shift its surroundings by default. Root elements carry
no outer margins — no `mb-4`, no exceptions for "just this once". Only styles
that make the component itself consistent belong in it; spacing between
components belongs to the consumer (`gap`, `space-y`) or to layout components
whose explicit job is layout (`s-form-item` rows, `s-layout` shell). Margins
leak: the consumer cannot unset what they cannot see. Enforced by
`tests/layout-neutrality.spec.ts`.

### II. One Height, One Language (NON-NEGOTIABLE)

Every single-line form control resolves to the same height at the same size
step (`xs 28 / sm 32 / md 36 / lg 40 / xl 44 / 2xl 48 / 3xl 56`) from the one
shared scale in `src/utils/fieldSize.ts` — never a per-component literal.
The library guarantees `box-sizing: border-box` on its controls. A select
next to an input must never look taller or shorter. Single-line controls use
`rounded-md`. Enforced by `tests/height-parity.spec.ts`.

### III. Class Hygiene & Theme Consistency (NON-NEGOTIABLE)

Components carry only required classes: no dead utilities, no speculative
wrappers, no copy-pasted layout guesses. All styling flows through `s-*`
utilities and `var(--s-*)` tokens — a hardcoded color or an off-palette
radius is a bug, because the component will look broken in the other theme.
Aesthetics are what this library sells: every component looks its best with
zero consumer adjustments. "Close enough" never ships.

### IV. Correct HTML Tags

Form values live on form elements: date triggers are readonly text inputs
(participating in submission, labels, placeholders, focus), never buttons.
Buttons perform actions. Icon-only controls expose their name via
`aria-label` (`title` alone is not a name) and dev-warn when unnamed.
Overlays close on Escape; lists move on arrows/Home/End; every input is
labelled. Enforced by `tests/scrutiny.spec.ts`, `tests/uncontrolled.spec.ts`.

### V. One Component Per Job

Reuse before create: list existing components that could cover the need
(variant, slot, composition) before adding surface area. Never ship two
implementations of one job — `s-date-picker range` covers ranges, so
`s-date-range-picker` was merged away, not aliased. Narrow exceptions
(`presets` → `options` rename) keep a deprecated alias; duplicated
implementations do not.

### VI. Spec-First, Test-Everything (NON-NEGOTIABLE)

No code without a spec trail: new behavior updates `docs/spec/` in the same
change. Every change ships with vitest coverage — mount it, click it, assert
emits and visible state. Never a throwaway verification script. Gates before
every commit: `npm test`, `npm run typecheck`, `npm run build`,
`npm run build:docs`. Tests run against `src` (no prior build needed);
`build:docs` proves the built bundle.

### VII. General-Purpose Copy & Living Docs

The library is domain-neutral: orders/customers/items, never rooms/guests/
bookings. `tests/vocabulary.spec.ts` fails the build on PMS vocabulary.
Docs update with the component: `meta.json` is the single source fanning out
to registry, `llms.txt` and MCP; every component page shows one titled
section per variation (`<!-- demo: Title — description -->`), each
copy-paste runnable. Demos never hide columns; tables scroll.

## Additional Constraints

- **Namespace or collide:** tags `s-*`, exports camelized (`s-date-picker` →
  `SDatePicker`, never `SXX`), classes/tokens `s-*`/`--s-*`. Coexists with
  Element Plus by construction. No icon libraries, no date libraries —
  vendored SVGs, native `Date`.
- **ESM-only distribution** with `types`+`import`+`default` on every subpath.
  `chart.js`/`vue-chartjs` stay optional peers behind the lazy runtime;
  anything importing them statically fails `tests/packaging.spec.ts`.
- **Mobile discipline:** small screens get single-month calendars with nav
  buttons (no sidebar, no dual pane), collapsing pagination, wrapping filter
  bars. Breakpoints, never JS resize handling, wherever CSS can do it.

## Development Workflow

Work flows `/speckit.specify` → `/speckit.plan` → `/speckit.tasks` →
`/speckit.implement`, grounded in this constitution and `docs/spec/`. Feature
specs live in `specs/`. Releases are explicit only: version both packages
together, finalize the changelog, publish, push `main`, tag `vX.Y.Z` — never
commit, push, tag, or publish without a direct instruction. Generated output
(`dist/`, `docs-dist/`, `docs/public/registry.json`, `llms.txt`) is never
committed.
