# 09 — Local Setup (fresh-clone continuity)

This spec guarantees: clone anywhere → install → test → build → develop,
with no tribal knowledge.

## Prerequisites

- Node 22 (CI pins `setup-node: 22`; both workflows assume it).
- npm (lockfiles: `package-lock.json`, `mcp/package-lock.json` — commit both).
- No global tools, no env secrets for development.

## From zero

```bash
git clone git@github.com:kundancool/simple-ui.git
cd simple-ui
npm install          # postinstall self-links the package for docs
npm test             # works with no prior build (tests alias to src)
npm run build        # lib + registry (dist/, docs/public/registry.json, llms.txt)
npm run build:docs   # full docs SPA against the built bundle
```

## Daily development

```bash
npm run dev          # watch library rebuilds + docs with HMR
npm run dev:docs     # docs only (run build:lib first after src edits)
npm run typecheck    # vue-tsc
```

## What is generated (never commit)

`dist/`, `docs-dist/`, `mcp/dist/`, `docs/public/registry.json`, `llms.txt`,
`llms-full.txt` (see `.gitignore`). If docs look stale after `src` edits,
rebuild — `npm test` sees source, docs see `dist`.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Docs import the wrong code | `node scripts/link-self.mjs`, then rebuild |
| `ERR_MODULE_NOT_FOUND` for charts | install optional peers `chart.js vue-chartjs`, or don't render charts |
| `transitionend`-related flakes | check `prefers-reduced-motion` handling (`01`), never `none` |
| Registry count mismatch in CI | run `npm run build` — `dist/registry.json` is stale |

## Handoff checklist

A machine is "ready" when `npm test`, `npm run typecheck`, `npm run build`
and `npm run build:docs` all pass from a fresh clone.
