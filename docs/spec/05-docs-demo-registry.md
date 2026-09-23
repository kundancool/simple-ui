# 05 — Docs, Demos & Registry Sync

## Single source of truth

`src/components/<dir>/meta.json` is the source. `scripts/build-registry.mjs`
fans it out to:

- `dist/registry.json` — shipped with the npm package,
- `docs/public/registry.json` — served by the docs SPA (gitignored, rebuilt),
- `llms.txt` / `llms-full.txt` — agent-friendly docs (gitignored, rebuilt;
  `llms.txt` also shipped in the package `files`).

`npm run build` always runs `build:lib` then `build:registry`. Never edit the
generated outputs by hand.

## Docs examples

- One file per component: `docs/examples/<dir>.vue` (required by
  `tests/registry.spec.ts`).
- **MUST** import from `@kundancool/simple-ui` — the built package via the
  self-link (`scripts/link-self.mjs`), exactly like consumers. Never
  `../../src`.
- **MUST** mount without errors (`tests/examples.spec.ts` mounts every file).
- **MUST** import every component it renders (`tests/imports.spec.ts`).
- After `src` edits, rebuild before judging docs output: `npm test` uses the
  `src` alias, but `build:docs` compiles against `dist`.

## Demo pages

- Full-page stories live in `docs/pages/demo/*.vue`, auto-discovered by the
  docs SPA glob and by `tests/demo-pages.spec.ts` (every file mounts; count
  must stay ≥ 40).
- Keep one root `<div>`, import what you render, use generic vocabulary (`08`).
- Tables never hide columns — horizontal scroll instead.

## Docs IA

Sidebar, search palette, breadcrumbs, `llms.txt` and MCP all derive from
`meta.json` + `docs/categories.ts`. No manual nav edits when adding a
component — only add a demo page when the component deserves a full story.

## Icons

`src/icons/registry.ts` is generated from lucide via
`scripts/build-icons.mjs` (devDependency only) and vendored inline with an
ISC notice. The library keeps zero runtime icon dependencies. Icon names are
part of the public API and ship inside the registry.
