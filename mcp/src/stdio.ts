#!/usr/bin/env node
/**
 * Local (stdio) entry: `npx -y @kundancool/simple-ui-mcp`.
 *
 * Reads the registry from SIMPLE_UI_REGISTRY, the user's installed
 * @kundancool/simple-ui, the dev checkout, or the jsDelivr CDN — in that order.
 */
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createServer } from './tools.js'

const version = process.env.SIMPLE_UI_VERSION ?? 'latest'

async function main() {
    const server = await createServer(version)
    await server.connect(new StdioServerTransport())
}

main().catch((error) => {
    console.error('[simple-ui-mcp]', error)
    process.exit(1)
})
