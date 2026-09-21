# @kundancool/simple-ui-mcp

MCP server for Simple UI. Lets AI agents query component APIs, examples,
theme tokens and dashboard scaffolds — always for the caller's installed version.

## Use

Local (stdio):

```bash
npx -y @kundancool/simple-ui-mcp
```

```json
// opencode.json
{ "mcp": { "simple-ui": { "type": "local", "command": ["npx", "-y", "@kundancool/simple-ui-mcp"] } } }
```

Remote (hosted worker, no install):

```json
{ "mcp": { "simple-ui": { "type": "remote", "url": "https://simple-ui-mcp.kundancool.workers.dev/mcp" } } }
```

## Tools

`list_components`, `get_component_api`, `get_example`, `search_components`,
`get_theme_tokens`, `get_setup`, `scaffold_dashboard`.

## Registry resolution

`SIMPLE_UI_REGISTRY` path → installed `@kundancool/simple-ui` →
dev checkout → jsDelivr CDN (`?version=` on the worker, `SIMPLE_UI_VERSION` locally).
