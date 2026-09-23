# 07 — Packaging & Release

## Distribution (ESM-only)

- `module: ./dist/simple-ui.js`, no `main`/`unpkg`/`jsdelivr` (UMD/CJS would
  inline `require('chart.js')` and break peer-optional installs).
- Every `exports` subpath **MUST** carry `types` + `import` + `default`
  conditions (resolvers that don't match `import` need `default`).
- Published files: `dist`, `llms.txt`, `README.md`.
- Enforced by `tests/packaging.spec.ts`.

## Optional peers

`chart.js` + `vue-chartjs` are optional peers. Only `src/charts/runtime.ts`
may import them statically; chart components reach it via
`await import('…/charts/runtime')` and render a skeleton until it resolves.
Adding any other static chart import fails `packaging.spec.ts` (the 0.1.0 bug).

## Versioning

- Semver. Minor for new components, patch for fixes. Both packages
  (`@kundancool/simple-ui`, `@kundancool/simple-ui-mcp`) bump together.
- `CHANGELOG.md` gets a section per release describing components, API
  changes and copy passes.

## Release procedure

```bash
npm test && npm run typecheck && npm run build && npm run build:docs
# bump both versions (package.json + lockfiles), finalise CHANGELOG, commit
npm publish            # root: runs prepublishOnly build
(cd mcp && npm publish)
git push origin main
git tag -a vX.Y.Z -m "vX.Y.Z" && git push origin vX.Y.Z
```

The `publish` workflow (`.github/workflows/publish.yml`) fires on `v*` tags
but is idempotent: it skips versions already on the registry and skips
without `NPM_TOKEN`. Tag publishes are safe to re-run.

## MCP package notes

`mcp/` is a standalone package (`@kundancool/simple-ui-mcp`, Node ≥ 18)
with its own lockfile and build (`tsc`). Its `files` are `dist` + README.
Never import library source from it — it consumes the generated registry.
