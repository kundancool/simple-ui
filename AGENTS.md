# AGENTS.md — Simple UI

Spec-first repo. `.specify/memory/constitution.md` is supreme — read it,
then `docs/spec/README.md`, then the smallest spec covering the task,
before touching code. Feature work flows
`/speckit.specify` → `/speckit.plan` → `/speckit.tasks` → `/speckit.implement`.

- Component work → `docs/spec/03-component-contract.md` + `04-component-workflow.md`
- Look/motion/a11y → `01-design-principles.md`; tokens → `02-tokens-theming.md`
- Docs/demos/registry/MCP sync → `05-docs-demo-registry.md`; agents → `10-mcp-agents.md`
- Copy → `08-vocabulary.md` (domain-neutral: orders/customers/items/workspaces)
- Gates → `06-testing.md`; release → `07-packaging-release.md`; fresh clone → `09-local-setup.md`

Rules: reuse existing components before creating; `s-*` tags only;
`var(--s-*)` tokens only; tests for every change (`npm test`); never commit
generated output (`dist/`, `docs/public/registry.json`, `llms.txt`).
If reality contradicts a spec, update the spec in the same commit.
