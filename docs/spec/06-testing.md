# 06 — Testing

## Commands

```bash
npm test              # vitest run — full suite, no prior build needed
npm run typecheck     # vue-tsc --noEmit
npm run build         # lib + registry
npm run build:docs    # self-link + build + docs SPA compile
```

CI (`.github/workflows/ci.yml`, Node 22) runs typecheck → tests → build →
build:docs, then asserts the registry covers ≥ 60 components.

## Pyramid

- **Contract tests** (run on every change):
  `registry.spec.ts` (structure/exports/resolver/example),
  `imports.spec.ts` (everything rendered is imported),
  `packaging.spec.ts` (optional peers, export conditions, no UMD),
  `vocabulary.spec.ts` (domain-neutral copy), `spec-index.spec.ts` (this
  spec library exists and entry docs link to it).
- **Behavior tests**: mount, click, assert emits and visible state. New
  components need them (`tests/phase2.spec.ts` is the model).
- **Smoke tests**: `examples.spec.ts` (every docs example mounts),
  `demo-pages.spec.ts` (every demo mounts), `docs-routing.spec.ts`,
  `landing*.spec.ts`.
- **A11y/interaction**: `uncontrolled.spec.ts`, `scrutiny.spec.ts`
  (keyboard, labels, captions, inline mode).
- **Layout neutrality**: `layout-neutrality.spec.ts` (no outer margins on
  component roots — the godly rule, `01 §0`).
- **Height parity**: `height-parity.spec.ts` (every form control resolves to
  the shared scale at every size, `01 §Control height contract`).

## Rules

- Tests run against `src` via the `@kundancool/simple-ui → src/index.ts`
  alias (`vitest.config.ts`), so `npm test` works on a fresh clone with no
  build. The built bundle is verified end-to-end by `build:docs`.
- Do not create throwaway verification scripts — write or update a vitest
  spec instead.
- Run the minimum affected specs while iterating, the full suite before
  committing (`npm test` ≈ 480 specs).
- Every fix ships with a regression test; every new component ships with
  behavior tests.
