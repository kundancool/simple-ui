# 10 — MCP & Agents

## Purpose

`@kundancool/simple-ui-mcp` lets AI agents query component APIs, examples,
theme tokens and dashboard scaffolds — always for the caller's installed
version — so a user can build a dashboard from a few prompts.

## Tools

`list_components`, `get_component_api`, `get_example`, `search_components`,
`get_theme_tokens`, `get_setup`, `scaffold_dashboard`, `list_icons`,
`new_component_guide`. Scaffolds and guide copy **MUST** obey `08`.

## Registry resolution (in order)

`SIMPLE_UI_REGISTRY` path → user's installed `@kundancool/simple-ui` → dev
checkout → jsDelivr CDN (`?version=` on the worker, `SIMPLE_UI_VERSION`
locally). Documented in `mcp/README.md`, implemented in `mcp/src/registry.ts`.

## Hosting

Stateless and read-only — any free edge host works (Cloudflare Workers,
100k req/day free). The worker fetches `registry.json` from jsDelivr per
request, so it never needs redeploying on library releases. Deploy:

```bash
cd mcp
npm install
npx wrangler deploy
```

Details in `mcp/DEPLOY.md`. `src/http.ts` is platform-free and ports to any
edge runtime unchanged.

## Agent rules

1. Discover, don't invent: component names, props and icon names come from
   the registry (`list_components`, `get_component_api`, `list_icons`).
2. Copy the `meta.json` example as the starting point, then adapt.
3. Theme via `--s-*` overrides only (`get_theme_tokens`, `02`).
4. Keep independence: the MCP package consumes the generated registry, never
   library source.
