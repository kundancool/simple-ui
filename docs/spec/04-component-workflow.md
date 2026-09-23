# 04 — Component Workflow

Canonical checklist for adding a component. `CONTRIBUTING.md` points here.
Each step is enforced — a missed step fails loudly instead of shipping silently.

1. **Scaffold `src/components/<dir>/`** per `03` (`<Pascal>.vue`,
   `index.ts`, `meta.json`).
2. **Name it so Vue resolves it** (`03` naming rules).
3. **Export it** from `src/components.ts` (alphabetical).
4. **Add it to `src/resolver.ts`** `COMPONENTS` (alphabetical).
5. **Add a docs example** at `docs/examples/<dir>.vue` importing from
   `@kundancool/simple-ui` (the built package — never `../../src`).
6. **Add behavior tests** in `tests/`: mount it, click it, assert emits and
   visible state. Uncontrolled selection state must work.
7. **Prove layout neutrality**: the root carries no outer margin
   (`tests/layout-neutrality.spec.ts` scans it). Spacing in the demo comes
   from the parent (`gap`, `space-y`), never the component.
8. **Prove height parity**: form controls share the size scale
   (`tests/height-parity.spec.ts`). No per-component height literals, no dead
   utilities, theme-consistent class names only.
7. **Use it somewhere real** — a demo page, the landing page, or another
   component. Unused components rot.
8. **Run the gates** (`06`): `npm test`, `npm run build`, `npm run build:docs`.
9. **Docs IA is automatic** — sidebar, palette, breadcrumbs, `llms.txt` and
   MCP pick the component up from `meta.json`. Only add a full demo page if
   the component deserves a full-page story.

## Scaffolding shortcut

There is no generator: copy the smallest neighboring component directory
(same category) and rename. The registry test tells you what you missed.

## Reviews check

- Reuse-first justification present?
- `meta.json` example copy domain-neutral (`08`)?
- Example imports from the package name, not a relative path?
- Keyboard + focus behavior covered by a test?
