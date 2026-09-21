# Hosting the Simple UI MCP (free)

The server is stateless and read-only, so any free edge host works.
Recommended: Cloudflare Workers (100k req/day free).

## Deploy

```bash
cd mcp
npm install
npx wrangler deploy   # bundles src/http.ts → dist/worker.js
```

The worker fetches `registry.json` from jsDelivr per request (`?version=`),
so **it never needs redeploying on library releases** — new versions are
served automatically. Responses are edge-cached per immutable version.

## Porting elsewhere

`src/http.ts` is a plain `fetch(request: Request) => Response` handler with
no platform imports — it runs on Vercel/Netlify Edge Functions, Deno Deploy
or Supabase Edge Functions unchanged.
