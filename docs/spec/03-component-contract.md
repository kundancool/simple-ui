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
- Errors replace hints in one slot with `role="alert"`; success uses
  `role="status"` where applicable.

## Accessibility & keyboard

- Every input **MUST** be labelled (`label` prop or `aria-label` fallback).
- Lists/tabs/ratings **MUST** support arrows/Home/End; overlays **MUST** close
  on Escape. Enforced by `tests/scrutiny.spec.ts`.
- Focus follows `01`: `s-focus-ring` on `:focus-visible` for buttons/menus,
  border+halo for fields, wrapper ring via `:focus-within` for composites.
- Tables render a `<caption>` for screen readers when a caption is given.
- Never shadow JS globals with imports (the Lucide `Map` icon broke
  `new Map()` in production — alias it).
- Single root element per component inside `<Transition>`.

## Reuse before create

Before adding a component, list existing components that could cover the need
(variant, slot or composition first). New surface area needs a justification
in the commit message.
