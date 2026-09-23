# 00 — Overview

## What this is

Simple UI (`@kundancool/simple-ui`) is a lightweight Vue 3 component library
for dashboards and admin apps: `s-*`-prefixed components (e.g. `<s-input>`,
`<s-data-table>`) that coexist with Element Plus (`El*`) without collision.

## Who it serves

- **App developers** building dashboards, admin panels and store flows.
- **AI agents** building dashboards from a few prompts, via the MCP server
  (`@kundancool/simple-ui-mcp`), `llms.txt` and the generated registry.

## Non-goals

- Not a design-system fashion statement: no marketing-site widgets, no
  bespoke illustration kit.
- Not a framework: no router, store or HTTP client opinions. Components take
  props and emit events; data fetching stays in the app.
- Not Element Plus compatible by API: only the `s-` prefix coexistence is
  guaranteed, so both libraries can live in one app.

## Architecture at a glance

- `src/components/<dir>/` — one directory per component (see `03`).
- `src/components.ts` — barrel import/export of every component.
- `src/resolver.ts` — `SimpleUIResolver()` for on-demand auto-import.
- `src/index.ts` — plugin (`app.use(SimpleUI, { prefix })`), composables, theme.
- `src/styles/tokens.css` — `--s-*` tokens + `s-` utilities (see `02`).
- `src/icons/registry.ts` — vendored icon set, zero runtime dependency.
- `src/charts/runtime.ts` — lazy chart loader; the only place `chart.js` may
  be imported statically (see `07`).
- `scripts/build-registry.mjs` — single source-of-truth fan-out (see `05`).
- `docs/` — docs SPA: `examples/` (one per component), `pages/demo/` (full
  stories), `pages/*.vue` (guides).
- `mcp/` — standalone MCP server package.
- `tests/` — vitest suite; `npm test` runs against `src`, never `dist`.

## Current shape

Component count and demo count change every release — read them from the
source, not from memory: `src/components/*/meta.json` (count) and
`docs/pages/demo/*.vue` (demos). `README.md` states the release counts.
