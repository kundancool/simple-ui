import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { loadRegistry, type Registry } from './registry.js'

const TOKEN_GUIDE = [
    'Theme tokens (all prefixed --s-, override any of them):',
    '--s-accent (teal light / crimson dark), --s-accent-hover, --s-accent-text',
    '--s-danger, --s-warning, --s-success (+ -hover each)',
    '--s-bg, --s-surface, --s-surface-raised, --s-sidebar',
    '--s-text-primary, --s-text-secondary, --s-text-muted, --s-text-placeholder',
    '--s-border, --s-border-subtle, --s-border-input, --s-border-strong',
    'Subtle/border shades derive from their base via color-mix(): overriding one base re-themes the family.',
    'Dark mode: toggle the `dark` class on <html> (see useDark()).',
    'CSS: :root { --s-accent: #7c3aed; } — or runtime: setPrimary("#7c3aed").',
].join('\n')

const DASHBOARD_SCAFFOLD = `<script setup>
import { ref, onMounted } from 'vue'

const tab = ref('all')
const tabs = [
  { key: 'all', label: 'All' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'pending', label: 'Pending' },
]
const query = ref('')
const page = ref(1)
const total = ref(0)
const loading = ref(false)
const rows = ref([])
const kpis = ref([])

async function fetchRows() {
  loading.value = true
  try {
    const params = new URLSearchParams({ page: String(page.value), q: query.value, tab: tab.value })
    const res = await fetch('/api/bookings?' + params)
    const json = await res.json()
    rows.value = json.data ?? []
    total.value = json.total ?? 0
    kpis.value = json.kpis ?? []
  } finally {
    loading.value = false
  }
}

onMounted(fetchRows)
<\/script>

<template>
  <s-page-header title="Bookings" subtitle="Today at a glance" add-text="New booking" refreshable :loading="loading" @refresh="fetchRows" />
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
    <s-stat-card v-for="kpi in kpis" :key="kpi.label" v-bind="kpi" />
  </div>
  <s-tabs v-model="tab" :tabs="tabs" />
  <s-card>
    <s-filter v-model="query" placeholder="Search bookings..." @search="fetchRows" />
    <s-data-table :data="rows" :loading="loading">
      <s-data-table-column prop="booking_no" label="Booking" />
      <s-data-table-column prop="guest_name" label="Guest" />
      <s-data-table-column label="Status">
        <template #default="{ row }">
          <s-tag :type="row.status === 'CONFIRMED' ? 'success' : 'warning'">{{ row.status }}</s-tag>
        </template>
      </s-data-table-column>
      <s-data-table-column prop="total_amount" label="Total" align="right" />
    </s-data-table>
    <div class="mt-3">
      <s-pagination v-model:page="page" :total="total" @change="fetchRows" />
    </div>
  </s-card>
</template>`;

function text(body: string) {
    return { content: [{ type: 'text' as const, text: body }] }
}

export function registerTools(server: McpServer, getRegistry: () => Promise<Registry>) {
    server.tool('list_components', 'List every Simple UI component with a one-line description.', async () => {
        const registry = await getRegistry()
        const lines = registry.components.map((c) => `- ${c.name} (<${c.tag}>): ${c.description}`)
        return text(`Simple UI v${registry.version} — ${registry.components.length} components, used as <${registry.prefix.toLowerCase()}-…> tags:\n${lines.join('\n')}`)
    })

    function find(registry: Registry, name: string) {
        const q = name.toLowerCase().replace(/^<|>$/g, '')
        return registry.components.find(
            (c) =>
                c.name.toLowerCase() === q ||
                c.tag === q ||
                c.dir === q ||
                `s${c.name.toLowerCase().replace(/ /g, '')}` === q,
        )
    }

    server.tool(
        'get_component_api',
        'Full API (props, events, slots) for one or more components. Always call this before writing component code.',
        { names: z.array(z.string()).describe('Component names or tags, e.g. ["Data Table", "<s-data-table>"]') },
        async ({ names }) => {
            const registry = await getRegistry()
            const out = names.map((name) => {
                const hit = find(registry, name)
                if (!hit) {
                    return `## ${name}\nNot found. Call list_components for valid names.`
                }
                const props = (hit.props ?? []).map((p) => `- ${p.name} (${p.type ?? 'any'}, default ${p.default ?? '—'}): ${p.description ?? ''}`)
                const events = (hit.events ?? []).map((e) => `- ${e.name}: ${e.description ?? ''}`)
                const slots = (hit.slots ?? []).map((s) => `- ${s.name}${s.params ? ` ${s.params}` : ''}: ${s.description ?? ''}`)
                return [
                    `## ${hit.name} (<${hit.tag}>)`,
                    hit.description,
                    '',
                    'Props:',
                    ...props,
                    '',
                    'Events:',
                    ...events,
                    '',
                    'Slots:',
                    ...slots,
                ].join('\n')
            })
            return text(out.join('\n\n'))
        },
    )

    server.tool(
        'get_example',
        'Copy-paste usage snippet for a component.',
        { name: z.string().describe('Component name or tag, e.g. Dialog or <s-dialog>') },
        async ({ name }) => {
            const registry = await getRegistry()
            const hit = find(registry, name)
            if (!hit?.example) {
                return text(`No example for "${name}". Call list_components for valid names.`)
            }
            return text(`## ${hit.name} (<${hit.tag}>) example\n\`\`\`vue\n${hit.example}\n\`\`\``)
        },
    )

    server.tool(
        'search_components',
        'Fuzzy-search components by name or description.',
        { query: z.string().describe('Search text, e.g. "table" or "date"') },
        async ({ query }) => {
            const registry = await getRegistry()
            const q = query.toLowerCase()
            const hits = registry.components.filter(
                (c) =>
                    c.name.toLowerCase().includes(q) ||
                    c.tag.includes(q) ||
                    c.description.toLowerCase().includes(q),
            )
            if (!hits.length) {
                return text(`No components match "${query}".`)
            }
            return text(hits.map((c) => `- ${c.name} (<${c.tag}>): ${c.description}`).join('\n'))
        },
    )

    server.tool(
        'list_icons',
        'Names accepted by s-icon (case-insensitive). Use these instead of importing an icon library.',
        {},
        async () => {
            const registry = await getRegistry()
            const names = registry.icons ?? []
            if (!names.length) {
                return text('This version of the registry does not expose icon names.')
            }
            return text(`s-icon name="…" accepts ${names.length} names:\n\n${names.join(', ')}`)
        },
    )

    server.tool('get_theme_tokens', 'Theme variables, dark mode and override recipes.', async () => {        const registry = await getRegistry()
        const extra = [registry.theme?.strategy, registry.theme?.dark, registry.theme?.example]
            .filter(Boolean)
            .join('\n')
        return text(`${TOKEN_GUIDE}\n${extra}`)
    })

    server.tool(
        'get_setup',
        'Install/import snippets for the requested integration style.',
        {
            mode: z.enum(['full', 'single', 'resolver', 'prefix']).default('full').describe('Integration style.'),
        },
        async ({ mode }) => {
            const registry = await getRegistry()
            const pkg = registry.package
            const modes: Record<string, string> = {
                full: registry.install?.setup ?? '',
                single: registry.install?.single ?? '',
                resolver: `import Components from 'unplugin-vue-components/vite'\nimport { SimpleUIResolver } from '${pkg}/resolver'\n\nexport default {\n  plugins: [Components({ resolvers: [SimpleUIResolver()] })],\n}\n// plus once in your entry: import '${pkg}/dist/simple-ui.css'`,
                prefix: `import SimpleUI from '${pkg}'\napp.use(SimpleUI, { prefix: 'Tmk' }) // <tmk-button>, <tmk-input>, …`,
            }
            return text(`## setup (${mode})\n\`\`\`js\n${modes[mode]}\n\`\`\``)
        },
    )

    server.tool(
        'scaffold_dashboard',
        'Complete dashboard page starter (header, stat cards, tabs, filter, table, pagination wired to fetch).',
        {},
        async () => text(`\`\`\`vue\n${DASHBOARD_SCAFFOLD}\n\`\`\``),
    )

    server.tool(
        'new_component_guide',
        'Checklist for adding a component without missing integration points.',
        {},
        async () =>
            text(
                [
                    '1. Scaffold src/components/<dir>/ with <Pascal>.vue, index.ts, meta.json.',
                    '2. Name the export so the tag resolves: s-date-picker -> SDatePicker (never SXX forms like SCTA).',
                    '3. Export from src/components.ts and list in src/resolver.ts COMPONENTS.',
                    '4. Add docs/examples/<dir>.vue importing from the package name (never relative src).',
                    '5. Add behavior tests, including uncontrolled interaction (no v-model).',
                    '6. Use it in a demo, the landing page, or another component.',
                    '7. No icon/date libraries; tokens only; data-overlay on teleported popovers; z-index via vars; keyboard parity; s-focus-ring on :focus-visible only.',
                    '8. Run: npm test, npm run build, npm run build:docs.',
                ].join('\n'),
            ),
    )
}

export async function createServer(version = 'latest'): Promise<McpServer> {
    const server = new McpServer({ name: 'simple-ui', version: '0.1.0' })
    registerTools(server, () => loadRegistry(version))
    return server
}
