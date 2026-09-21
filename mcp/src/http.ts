/**
 * Remote (Streamable HTTP) entry for edge hosting (e.g. Cloudflare Workers).
 *
 * Stateless: every request spins up a server bound to the requested version.
 * `GET/POST /mcp?version=0.1.0` — omitted version means latest.
 */
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { createServer } from './tools.js'

export default {
    async fetch(request: Request): Promise<Response> {
        const url = new URL(request.url)
        if (!url.pathname.endsWith('/mcp')) {
            return new Response('Simple UI MCP — POST /mcp', { status: 404 })
        }
        try {
            const server = await createServer(url.searchParams.get('version') ?? 'latest')
            const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined })
            await server.connect(transport)
            return await transport.handleRequest(request)
        } catch (error) {
            return new Response(`MCP error: ${error instanceof Error ? error.message : error}`, {
                status: 500,
            })
        }
    },
}
