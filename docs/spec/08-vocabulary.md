# 08 — Vocabulary

The library is a general-purpose UI kit. Copy **MUST** stay domain-neutral.

## Preferred terms

Orders, customers, items, workspaces, channels, categories, periods, days.

## Banned terms (enforced)

Hospitality/PMS vocabulary — rooms, guests, bookings, reservations, nights,
OTAs, check-in/out-as-nouns, and brand names (MakeMyTrip, Goibibo,
Booking.com, MMT, Acme Stays, Tripmakerz). The exact pattern list lives in
`tests/vocabulary.spec.ts`, which scans `docs/examples`, `docs/pages`,
`docs/App.vue`, `src/components`, `mcp/src/tools.ts`, `README.md`,
`DESIGN.md`, `CONTRIBUTING.md`, `CHANGELOG.md` and `tests/`.

## Rules

- Examples, demos, `meta.json` copy and MCP scaffolds use the preferred
  terms. `checkout` (generic commerce) is allowed; `check-in` is not.
- Generic English words (`room` as in "room to grow", `stay` as in "stay in
  sync") are acceptable in prose but hospitality senses are not — prefer a
  rewrite over a borderline keep.
- New components, examples and demos **MUST** pass `vocabulary.spec.ts`
  before commit. If a legitimate term trips the guard, narrow the pattern in
  the spec — never sprinkle exceptions in copy.
