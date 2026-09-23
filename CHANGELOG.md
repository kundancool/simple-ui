# Changelog

## 0.4.0

- **One date component (breaking).** `s-date-range-picker` is merged into
  `s-date-picker range` (two calendars on desktop, one stacked on mobile;
  single month + nav buttons on small screens, options sidebar desktop-only).
  The trigger is a readonly text input with native form participation.
  Shortcut `presets` become `options` (`presets` still works as a deprecated
  alias), with no options unless the consumer defines them. New `valueFormat`
  (emitted shape, `format` stays visual), `disabledDate` / `disabledRanges`
  rules, and one centered calendar heading.
- **Full t-shirt sizes.** Every `size` prop accepts
  `xs | sm | md | lg | xl | 2xl | 3xl` from the shared scale
  (`src/utils/fieldSize.ts`), including `IconRender` which now mirrors
  `SIcon` glyphs exactly.
- **Uncontrolled selection everywhere.** Rating, segmented, tabs and steps
  move without a `v-model` listener (carousel pattern); tabs/steps default
  to their first item.
- **Upload robustness.** Forwards consumer `class`/`style`, aborts stalled
  requests via a `timeout` prop (emits `timeout` + `error`), and aborts
  in-flight requests on unmount.
- **Docs showcase.** Every component page shows one titled section per
  variation, each with description, live demo and code.
- **Fixes.** Textarea padding and size steps; Firefox select focus ring;
  palette input focus and duplicate keys; breadcrumb duplicate keys; docs
  shell themed text so icons follow dark mode; circle buttons warn without
  an accessible name; carousel stable keys; optional stat-card icon/label
  and icon name; meta gaps closed (input/select/date events, slots, sizes)
  and the phantom `data-table-column.class` doc removed.

## 0.3.0

- **Layout neutrality (breaking).** Form controls no longer ship a default
  outer margin: `SInput`, `SSelect`, `SDatePicker`, `SDateRangePicker`,
  `SMultiSelect`, `SCheckbox`, `SNumberInput`, `SUpload`, `SFilter`,
  `SPageHeader` and `STimeline` render margin-free roots. Spacing between
  components now belongs to the consumer (parent `gap` / `space-y`) or to
  `s-form-item`, which keeps owning form-row rhythm. Migration: wrap stacked
  fields in `space-y-4` (or add `mb-4`/`mb-5` at the usage site); the
  `inline` prop is a deprecated no-op kept for compatibility. Enforced by
  `tests/layout-neutrality.spec.ts`; see `docs/spec/01-design-principles.md §0`.
- **Control height contract.** `SDatePicker`, `SMultiSelect` and `SNumberInput`
  join the shared size scale (`xs 28 / sm 32 / md 36 / lg 40`) via
  `src/utils/fieldSize.ts` — a mixed row of inputs, selects, date triggers
  and steppers now lines up at every size. The library guarantees
  `box-sizing: border-box` on controls, `SFilter` uses the standard `rounded-md`,
  `SButton` lg uses `rounded-md`, and pagination compact rows resolve 32px
  through `--s-field-h`. Enforced by `tests/height-parity.spec.ts`.

## 0.2.0

Eight new components (61 → 69) and a general-purpose-copy pass.

- **New components:** `SIcon` (77 vendored icons, zero runtime icon
  dependency), `SForm` + `SFormItem` (label position/width, cascading
  size/disabled, `scrollToFirstError()`), `SSpinner`, `SOption`, `SRadio`,
  `SRadioGroup` and `SUpload` (XHR multipart, progress, queueing, CSRF meta).
- **`SSelect` rewritten** around `<s-option>` children (array options still
  work): `empty-text`, `clear` / `visible-change` emits, size inheritance, and
  correct coercion of bare boolean attributes such as `<s-option disabled />`.
- **`SInput` extensions:** `input` / `change` / `blur` / `focus` / `clear` /
  `toggle-visibility` events, attribute forwarding to the real control,
  `size`, `clearable`, `readonly`, word-limit counter and prefix/suffix slots.
- **MCP:** the generated registry now carries icon names and the server exposes
  `list_icons`.
- **Domain-neutral copy.** Every example, demo, `meta.json` entry and MCP
  scaffold now uses general-purpose vocabulary (orders, customers, items,
  workspaces) instead of hospitality/PMS terms (rooms, guests, bookings,
  nights, OTAs). Added `tests/vocabulary.spec.ts` so that vocabulary cannot
  regress.

## 0.1.1

Fixes two defects that made the published 0.1.0 unusable for most consumers.

- **chart.js is now genuinely optional.** The ESM entry statically imported
  `chart.js` and `vue-chartjs`, so `import '@kundancool/simple-ui'` threw
  `ERR_MODULE_NOT_FOUND` unless both peers were installed — even for projects
  that never render a chart. Charts now load their runtime through a dynamic
  import, so the peers are fetched only when a chart is on screen, and the
  components show a skeleton until then.
- **ESM-only distribution.** The UMD bundle could not code-split, so it inlined
  a hard `require('chart.js')`; `main`/`unpkg`/`jsdelivr` therefore resolved to
  a bundle that failed to load without the chart peers. Those fields and the
  UMD build are gone; `module` and the `exports` map point at the ESM bundle.
- **Every subpath entry gained a `default` condition**, so resolvers that do
  not match `import` no longer fail with `ERR_PACKAGE_PATH_NOT_EXPORTED`
  (`./resolver` and `./components/*`).
- Added `tests/packaging.spec.ts`: fails if anything imports the chart peers at
  module scope, if a subpath loses a condition, or if a UMD/CJS bundle is
  advertised again. Chart tests now assert the skeleton-before-canvas order.

## 0.1.0
- Initial release: 61 components (form, data, feedback, navigation, layout,
  landing/blog kit, charts).
- Theme engine: `--s-*` tokens, light/dark palettes, `setTheme`/`useDark` helpers.
- Per-component ESM imports, subpath exports, `SimpleUIResolver` for on-demand loading.
- Docs SERVICES, generated component registry, `llms.txt`, MCP server (`@kundancool/simple-ui-mcp`).
