# Feature Specs

One directory per feature, created via `/speckit.specify`:

```text
specs/<nnn>-<short-name>/
  spec.md    # what + why (user-visible behavior, acceptance criteria)
  plan.md    # how (design, files, risks) — via /speckit.plan
  tasks.md   # ordered units, each mapped to tests — via /speckit.tasks
```

Every spec is governed by `.specify/memory/constitution.md` and grounded in
`docs/spec/`. Implement only from `tasks.md` (`/speckit.implement`), and run
the gates in `docs/spec/06-testing.md` before committing. No spec —
no code.
