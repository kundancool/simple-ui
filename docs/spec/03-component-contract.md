# 03 — Component Contract

Normative rules for every component. `tests/registry.spec.ts` enforces the
structural half; behavior tests enforce the rest.

## Naming

- Tag **MUST** be `s-*` (e.g. `s-date-picker`), never `El*`.
- Export name **MUST** equal the tag camelized: `s-date-picker` →
  `SDatePicker`. Names with adjacent capitals (`SCTA`, `STOC`) never resolve —
  write `SCta`, `SToc`.
- `defineOptions({ name })` **MUST** match the export.
- `app.use(SimpleUI)` registers `S*` names; `{ prefix }` option registers an
  additional `<Prefix*>` alias for clashing hosts.

## Files

Each `src/components/<dir>/` **MUST** contain exactly:

- `<Pascal>.vue` — the component: `s-`-prefixed classes only, no app
  imports, no icon libraries, no date libraries (inline SVG, native `Date`).
- `index.ts` — `export { S<Name> }` plus a default export.
- `meta.json` — `{ name, tag, category, description, props, events, slots,
  example }`. Feeds docs, registry, `llms.txt` and MCP.

`category` **MUST** be one of `docs/categories.ts`
(`Basic | Form | Data | Feedback | Navigation | Layout | Charts`).

## Registration

- Add import + export in `src/components.ts` (alphabetical).
- Add the name to `COMPONENTS` in `src/resolver.ts` (alphabetical).

## API conventions

- Props use descriptive names (`isRegisteredForDiscounts`, not `discount`).
- Validation lives in Form Request-style component props with clear
  `type`/`default`/`description` in `meta.json` — docs render from it.
- Selection state **MUST** work uncontrolled (Accordion/Carousel/Lightbox
  pattern); binary controls stay `v-model`-driven.
  Enforced by `tests/uncontrolled.spec.ts`.
- Curated option lists (date shortcuts) share one shape
  (`{ label, value } | { label, range: [from, to] }`, resolved in
  `src/utils/dateOptions.ts`), validate before applying, and never throw on
  malformed entries — a bad option is ignored, not emitted.
- One component per job: `s-date-picker range` covers ranges (two calendars
  on desktop, one stacked on mobile). `s-date-range-picker` was merged away —
  no second implementation, no alias.

## Layout neutrality (godly rule)

Per `01 §0`: root elements **MUST NOT** carry outer margins. Only styles
that make the component itself consistent belong in it; inter-component
spacing belongs to the consumer or to layout components (`s-form-item`,
`s-layout`). Internal rhythm (label→control→error) stays. Enforced by
`tests/layout-neutrality.spec.ts`.

## Height participation

Per `01 §Control height contract`: every single-line form control **MUST**
accept `size`, inherit it from the form context, and set `--s-field-h` from
the shared scale — so a mixed row lines up by construction. Enforced by
`tests/height-parity.spec.ts`.
- Errors replace hints in one slot with `role="alert"`; success uses
  `role="status"` where applicable.

## Accessibility & keyboard

- Every input **MUST** be labelled (`label` prop or `aria-label` fallback).
- Icon-only controls (circle buttons included) **MUST** expose their name via
  `aria-label` — `title` alone is not an accessible name. A component that can
  render without visible text **MUST** dev-warn when it has neither a `label`
  prop nor a consumer `aria-label`/`aria-labelledby`, so the missing name
  fails loudly in development instead of shipping silently to screen readers.
  Enforced by `tests/components.spec.ts`.
- Lists/tabs/ratings **MUST** support arrows/Home/End; overlays **MUST** close
  on Escape. Enforced by `tests/scrutiny.spec.ts`.
- Focus follows `01`: `s-focus-ring` on `:focus-visible` for buttons/menus,
  border+halo for fields, wrapper ring via `:focus-within` for composites.
- Tables render a `<caption>` for screen readers when a caption is given.
- List keys must stay unique even for duplicate values: key repeating data
  (links, labels) alone — suffix the index. Trails routinely repeat a
  section link, and duplicate keys warn in production.
- Never shadow JS globals with imports (the Lucide `Map` icon broke
  `new Map()` in production — alias it).
- Single root element per component inside `<Transition>`.

## Reuse before create

Before adding a component, list existing components that could cover the need
(variant, slot or composition first). New surface area needs a justification
in the commit message.
