<template>
    <div>
        <h1 class="text-2xl font-bold s-text-primary">Build with AI</h1>
        <p class="text-sm s-text-secondary mt-2 max-w-2xl">
            Three integration levels, fastest first. Everything is versioned, so agents always answer
            for the release you have installed.
        </p>

        <div class="mt-6 border s-border-theme rounded-xl overflow-hidden">
            <div class="p-4 md:p-5 border-b s-border-theme last:border-b-0">
                <div class="flex items-center gap-2 mb-1">
                    <span class="s-step-num">1</span>
                    <p class="text-sm font-semibold s-text-primary">Hosted MCP</p>
                </div>
                <p class="text-sm s-text-secondary mb-2 ml-9">Paste one URL into your agent config — no install, always current.</p>
                <div class="ml-0 sm:ml-9">
                    <DemoBlock title="opencode.json" :code="remoteCode" lang="json" />
                </div>
            </div>
            <div class="p-4 md:p-5 border-b s-border-theme last:border-b-0">
                <div class="flex items-center gap-2 mb-1">
                    <span class="s-step-num">2</span>
                    <p class="text-sm font-semibold s-text-primary">Local MCP</p>
                </div>
                <p class="text-sm s-text-secondary mb-2 ml-9">Runs on your machine via npx. Same tools, works offline.</p>
                <div class="ml-0 sm:ml-9">
                    <DemoBlock title="Terminal + config" :code="localCode" lang="bash" />
                </div>
            </div>
            <div class="p-4 md:p-5 border-b s-border-theme last:border-b-0">
                <div class="flex items-center gap-2 mb-1">
                    <span class="s-step-num">3</span>
                    <p class="text-sm font-semibold s-text-primary">llms.txt</p>
                </div>
                <p class="text-sm s-text-secondary mb-2 ml-9">For agents without MCP support — paste into context.</p>
                <div class="ml-0 sm:ml-9">
                    <DemoBlock title="URLs" :code="llmsCode" lang="text" />
                </div>
            </div>
        </div>

        <h2 class="text-lg font-semibold s-text-primary mt-10 mb-3">What the agent can do</h2>
        <s-data-table :data="capabilities" :stripe="false" size="small" border>
            <s-data-table-column prop="tool" label="Tool" width="200px">
                <template #default="{ row }"><code class="font-mono text-[12px] s-text-accent">{{ row.tool }}</code></template>
            </s-data-table-column>
            <s-data-table-column prop="does" label="What it answers" />
        </s-data-table>

        <h2 class="text-lg font-semibold s-text-primary mt-10 mb-3">The 2-prompt dashboard</h2>
        <DemoCard title="Prompt 1" :code="prompt1" lang="text">
            <p class="text-sm s-text-secondary">Ask for the page. The agent pulls the dashboard scaffold and component APIs from the MCP server — correct props, no guessing.</p>
        </DemoCard>
        <div class="mt-3">
            <DemoCard title="Prompt 2" :code="prompt2" lang="text">
                <p class="text-sm s-text-secondary">Iterate in plain language. Theme tokens and chart options come from the same source.</p>
            </DemoCard>
        </div>
        <div class="pb-6" aria-hidden="true" />
    </div>
</template>

<script setup>
import DemoBlock from '../DemoBlock.vue'
import DemoCard from '../DemoCard.vue'
import { SCard } from '@kundancool/simple-ui'
import { SDataTable } from '@kundancool/simple-ui'
import { SDataTableColumn } from '@kundancool/simple-ui'

const remoteCode = `{
  "mcp": {
    "simple-ui": { "type": "remote", "url": "https://simple-ui-mcp.kundancool.workers.dev/mcp" }
  }
}`
const localCode = `npm install -D @kundancool/simple-ui-mcp

// opencode.json
{
  "mcp": {
    "simple-ui": { "type": "local", "command": ["npx", "-y", "@kundancool/simple-ui-mcp"] }
  }
}`
const llmsCode = `https://kundancool.github.io/simple-ui/llms.txt
https://kundancool.github.io/simple-ui/llms-full.txt`

const capabilities = [
    { tool: 'list_components', does: 'Every component with a one-line description — lets the agent pick correctly.' },
    { tool: 'get_component_api', does: 'Full props, events and slots for named components before writing code.' },
    { tool: 'get_example', does: 'Copy-paste snippet per component.' },
    { tool: 'search_components', does: 'Fuzzy find by name or description ("table", "date").' },
    { tool: 'get_theme_tokens', does: 'Variables, dark mode and override recipes.' },
    { tool: 'get_setup', does: 'Install snippets for full, single, resolver and prefix styles.' },
    { tool: 'scaffold_dashboard', does: 'Complete dashboard starter wired to a fetch function.' },
]

const prompt1 = `Using @kundancool/simple-ui, scaffold a orders dashboard page: page header with add + refresh, 4 stat cards, tabs (All/Confirmed/Pending), a filter row, a data table with a status tag column, and pagination wired to fetchRows().`
const prompt2 = `Add a revenue line chart above the table and a dark-mode toggle in the header using useDark().`
</script>

