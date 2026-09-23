# Simple UI — Spec Index

This directory is the project's working memory. Any agent or human cloning
this repo anywhere should start here and work spec-first: read the relevant
spec, implement to it, then run the gates in `06-testing.md`.

## Precedence

1. `docs/spec/*.md` is normative. When-Ray other docs disagree, the spec wins.
2. `DESIGN.md` is the friendly design mirror — `01-design-principles.md` is canonical.
3. `CONTRIBUTING.md` is the contributor entry point — `04-component-workflow.md` is canonical.
4. `README.md` is the consumer entry point — it must stay short and link here.

## Specs

| File | Defines | Enforced by |
|---|---|---|
| `00-overview.md` | What the library is, who it serves, non-goals | — (orientation) |
| `01-design-principles.md` | Look, motion, states, responsive rules | visual review + behavior tests |
| `02-tokens-theming.md` | `--s-*` tokens, palettes, override contract | `tests/theme.spec.ts` |
| `03-component-contract.md` | Naming, files, `meta.json` schema, API + a11y rules | `tests/registry.spec.ts`, `tests/imports.spec.ts`, `tests/uncontrolled.spec.ts`, `tests/scrutiny.spec.ts` |
| `04-component-workflow.md` | Step-by-step for adding a component | `tests/registry.spec.ts` fails loudly on missed steps |
| `05-docs-demo-registry.md` | `meta.json` → registry → docs → `llms.txt` → MCP sync | `tests/examples.spec.ts`, `tests/demo-pages.spec.ts`, `tests/docs-routing.spec.ts`, `tests/landing*.spec.ts` |
| `06-testing.md` | Test pyramid, gates, commands | CI (`.github/workflows/ci.yml`) |
| `07-packaging-release.md` | ESM-only, exports, optional peers, versioning, publish | `tests/packaging.spec.ts`, `.github/workflows/publish.yml` |
| `08-vocabulary.md` | Domain-neutral copy, banned terms | `tests/vocabulary.spec.ts` |
| `09-local-setup.md` | Fresh-clone continuity: prereqs, commands, generated files | `tests/spec-index.spec.ts` (this index exists) |
| `10-mcp-agents.md` | Agent contract: registry, tools, scaffolds | `mcp/` build + registry resolution |

## Working spec-first

1. Pick the smallest spec that covers the task (new component → `03` + `04`).
2. Implement exactly what the spec says — no drive-by redesigns.
3. Run the gates in `06-testing.md` before committing.
4. If reality contradicts a spec, update the spec in the same commit as the
   code change. Undocumented divergence is a bug.
