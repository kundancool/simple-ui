# Changelog

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
