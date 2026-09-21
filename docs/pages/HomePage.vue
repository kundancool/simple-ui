<template>
    <div class="grid xl:grid-cols-[minmax(0,1fr)_200px] gap-8 items-start">
        <div class="min-w-0">
        <div class="s-hero rounded-2xl border s-border-theme px-6 py-10 md:p-12 text-center overflow-hidden relative">
            <div class="s-hero-grid" aria-hidden="true" />
            <div class="s-hero-glow s-hero-glow-a" aria-hidden="true" />
            <div class="s-hero-glow s-hero-glow-b" aria-hidden="true" />
            <div class="relative">
                <p class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold s-bg-accent-subtle s-text-accent uppercase tracking-wider">
                    Documentation
                </p>
                <h1 class="mt-4 text-3xl md:text-4xl font-bold tracking-tight s-hero-title">Getting started</h1>
                <p class="mt-3 s-text-secondary max-w-xl mx-auto text-sm md:text-base">
                    {{ count }} themeable components for dashboards and admin apps.
                    Install in a minute, browse everything below.
                </p>
                <div class="mt-6 flex flex-wrap justify-center gap-2">
                    <s-button @click="scrollToInstall">Install <ArrowRight class="w-4 h-4" /></s-button>
                    <s-button variant="secondary" @click="go('#/demo/dashboard')">Live demo</s-button>
                </div>
            </div>
        </div>

        <h2 id="install-steps" class="text-lg font-semibold s-text-primary mt-10 mb-3 scroll-mt-20">Install in three steps</h2>
        <div class="border s-border-theme rounded-xl overflow-hidden">
            <div class="flex gap-4 p-4 md:p-5 border-b s-border-theme last:border-b-0">
                <span class="s-step-num mt-0.5">1</span>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold s-text-primary">Add the package</p>
                    <p class="text-sm s-text-secondary mt-0.5 mb-2">Requires Vue 3.5+ and Node 18+. Works with npm, pnpm, yarn and bun.</p>
                    <DemoBlock :title="'Terminal'" :code="installCmd" lang="bash" />
                </div>
            </div>
            <div class="flex gap-4 p-4 md:p-5 border-b s-border-theme last:border-b-0">
                <span class="s-step-num mt-0.5">2</span>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold s-text-primary">Register + stylesheet</p>
                    <p class="text-sm s-text-secondary mt-0.5 mb-2">One import registers everything; the CSS is precompiled.</p>
                    <DemoBlock title="main.js" :code="setupCode" lang="js" />
                </div>
            </div>
            <div class="flex gap-4 p-4 md:p-5 border-b s-border-theme last:border-b-0">
                <span class="s-step-num mt-0.5">3</span>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold s-text-primary">Use a component</p>
                    <p class="text-sm s-text-secondary mt-0.5 mb-2">Drop a tag in any template — no extra setup.</p>
                    <DemoBlock title="App.vue" :code="usageCode" lang="vue" />
                </div>
            </div>
        </div>

        <h2 id="single" class="text-lg font-semibold s-text-primary mt-10 mb-3 scroll-mt-20">Single-component import</h2>
        <p class="text-sm s-text-secondary mb-2 max-w-2xl">Only need one piece? Import it directly — the bundler drops everything else.</p>
        <DemoBlock title="main.js" :code="singleCode" lang="js" />

        <h2 id="ondemand" class="text-lg font-semibold s-text-primary mt-10 mb-3 scroll-mt-20">On-demand components</h2>
        <p class="text-sm s-text-secondary mb-2 max-w-2xl">With <span class="font-mono">unplugin-vue-components</span>, tags resolve automatically with zero imports.</p>
        <DemoBlock title="vite.config.js" :code="resolverCode" lang="js" />

        <h2 id="prefix" class="text-lg font-semibold s-text-primary mt-10 mb-3 scroll-mt-20">Custom prefix</h2>
        <p class="text-sm s-text-secondary mb-2 max-w-2xl">Prefer different tags? Every component registers under your prefix instead.</p>
        <DemoBlock title="main.js" :code="prefixCode" lang="js" />

        <h2 id="charts" class="text-lg font-semibold s-text-primary mt-10 mb-3 scroll-mt-20">Charts need two peers</h2>
        <p class="text-sm s-text-secondary mb-2 max-w-2xl">Only the three chart components need these — everything else is dependency-free.</p>
        <DemoBlock title="Terminal" :code="chartsCode" lang="bash" />

        <h2 id="troubleshooting" class="text-lg font-semibold s-text-primary mt-10 mb-3 scroll-mt-20">Troubleshooting</h2>
        <s-data-table :data="faq" :stripe="false" size="small" border>
            <s-data-table-column prop="q" label="Symptom" width="240px" />
            <s-data-table-column prop="a" label="Fix" />
        </s-data-table>

        <h2 id="categories" class="text-lg font-semibold s-text-primary mt-10 mb-3 scroll-mt-20">Browse by category</h2>
        <div class="grid sm:grid-cols-2 gap-3">
            <a v-for="g in groups" :key="g.category" :href="`#/docs/components/${g.items[0].dir}`" class="s-cat-card group block border s-border-theme rounded-xl p-4 s-bg-surface">
                <div class="flex items-center gap-2">
                    <span class="w-7 h-7 rounded-lg s-bg-accent-subtle flex items-center justify-center flex-shrink-0">
                        <component :is="catIcon(g.category)" class="w-4 h-4 s-text-accent" />
                    </span>
                    <span class="text-sm font-semibold s-text-primary">{{ g.category }}</span>
                    <span class="px-1.5 py-0.5 rounded-full text-[11px] font-medium s-bg-surface-raised s-text-muted">{{ g.items.length }}</span>
                    <ArrowRight class="w-4 h-4 ml-auto s-text-muted s-cat-arrow transition-all" />
                </div>
                <p class="text-xs s-text-muted mt-2">{{ blurb(g.category) }}</p>
                <p class="mt-2 font-mono text-[12px] s-text-accent truncate">{{ g.items.slice(0, 4).map((i) => i.name).join(' · ') }}{{ g.items.length > 4 ? ' …' : '' }}</p>
            </a>
        </div>

        <h2 id="quicklook" class="text-lg font-semibold s-text-primary mt-10 mb-3 scroll-mt-20">Quick look</h2>
        <DemoCard :code="quickCode" title="QuickLook.vue">
            <div class="flex flex-col gap-3">
                <div class="flex items-center gap-2">
                    <div class="flex-1 min-w-0">
                        <s-input v-model="text" placeholder="Customer name — type here…" inline />
                    </div>
                    <s-button>Save</s-button>
                    <s-button variant="secondary">Cancel</s-button>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <s-tag type="success">Confirmed</s-tag>
                    <s-tag type="warning">Pending</s-tag>
                    <s-tag type="danger" variant="outline">Cancelled</s-tag>
                    <span class="inline-flex items-center gap-1.5 text-xs s-text-secondary"><s-switch v-model="on" aria-label="Demo switch" /> Notifications</span>
                    <s-button variant="danger" size="sm">Delete</s-button>
                </div>
            </div>
        </DemoCard>

        <div class="grid sm:grid-cols-3 gap-3 mt-6">
            <s-card>
                <div class="flex items-center gap-2 mb-1.5">
                    <span class="w-7 h-7 rounded-lg s-bg-icon-blue flex items-center justify-center"><Zap class="w-4 h-4 s-text-icon-blue" /></span>
                    <p class="text-sm font-semibold s-text-primary">Themed</p>
                </div>
                <p class="text-sm s-text-secondary"><span class="font-mono">--s-*</span> design tokens with light and dark palettes — override any variable to re-theme.</p>
            </s-card>
            <s-card>
                <div class="flex items-center gap-2 mb-1.5">
                    <span class="w-7 h-7 rounded-lg s-bg-icon-green flex items-center justify-center"><LayoutDashboard class="w-4 h-4 s-text-icon-green" /></span>
                    <p class="text-sm font-semibold s-text-primary">Dashboard-ready</p>
                </div>
                <p class="text-sm s-text-secondary">Tables, pagination, filters, date pickers, stat cards, charts and an app shell — everything a dashboard page needs.</p>
            </s-card>
            <s-card>
                <div class="flex items-center gap-2 mb-1.5">
                    <span class="w-7 h-7 rounded-lg s-bg-icon-purple flex items-center justify-center"><Bot class="w-4 h-4 s-text-icon-purple" /></span>
                    <p class="text-sm font-semibold s-text-primary">Agent-friendly</p>
                </div>
                <p class="text-sm s-text-secondary">Generated registry, <span class="font-mono">llms.txt</span> and an MCP server so AI agents scaffold with correct APIs.</p>
            </s-card>
        </div>
        </div>
        <aside class="hidden xl:block sticky top-20 w-50">
            <s-toc :items="toc" />
        </aside>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Zap, LayoutDashboard, Bot, ArrowRight, MousePointerClick, TextCursorInput, Table2, BellRing, Compass, PanelLeft, ChartColumn, LayoutGrid } from 'lucide-vue-next'
import DemoBlock from '../DemoBlock.vue'
import DemoCard from '../DemoCard.vue'
import { CATEGORY_ORDER, CATEGORY_BLURB } from '../categories'
import { SButton } from '@kundancool/simple-ui'
import { STag } from '@kundancool/simple-ui'
import { SSwitch } from '@kundancool/simple-ui'
import { SInput } from '@kundancool/simple-ui'
import { SCard } from '@kundancool/simple-ui'
import { SDataTable } from '@kundancool/simple-ui'
import { SDataTableColumn } from '@kundancool/simple-ui'
import { SToc } from '@kundancool/simple-ui'

const props = defineProps({ registry: { type: Object, default: () => ({}) } })

const on = ref(true)
const text = ref('')

const groups = computed(() => {
    const items = props.registry.components ?? []
    const byCat = new Map()
    for (const c of items) {
        const cat = c.category || 'Others'
        if (!byCat.has(cat)) {
            byCat.set(cat, [])
        }
        byCat.get(cat).push(c)
    }
    return CATEGORY_ORDER.filter((cat) => byCat.has(cat)).map((cat) => ({ category: cat, items: byCat.get(cat) }))
})

const count = computed(() => props.registry.components?.length ?? 0)

const CAT_ICONS = {
    Basic: MousePointerClick,
    Form: TextCursorInput,
    Data: Table2,
    Feedback: BellRing,
    Navigation: Compass,
    Layout: PanelLeft,
    Charts: ChartColumn,
}

function catIcon(cat) {
    return CAT_ICONS[cat] ?? LayoutGrid
}

function blurb(cat) {
    return CATEGORY_BLURB[cat] ?? ''
}

const name = computed(() => props.registry.package ?? '@kundancool/simple-ui')
const installCmd = computed(() => `npm install ${name.value}`)
const setupCode = computed(() => `import SimpleUI from '${name.value}'\nimport '${name.value}/dist/simple-ui.css'\n\nconst app = createApp(App)\napp.use(SimpleUI)`)
const usageCode = computed(() => `<s-input v-model="name" label="Customer name" />\n<s-button @click="save">Save</s-button>`)
const singleCode = computed(() => `import { SButton } from '${name.value}'\nimport '${name.value}/dist/simple-ui.css'\n\napp.component('SButton', SButton)`)
const resolverCode = computed(() => `import Components from 'unplugin-vue-components/vite'\nimport { SimpleUIResolver } from '${name.value}/resolver'\n\nexport default {\n  plugins: [Components({ resolvers: [SimpleUIResolver()] })],\n}`)
const prefixCode = computed(() => `app.use(SimpleUI, { prefix: 'Tmk' })\n// <tmk-button>, <tmk-input>, …`)
const chartsCode = 'npm install chart.js vue-chartjs'

const faq = [
    { q: 'Components render unstyled', a: 'Import the stylesheet once in your entry file (see step 2). The precompiled CSS is required.' },
    { q: 'Charts throw on mount', a: 'Install the chart.js + vue-chartjs peers. Only charts need them.' },
    { q: 'Dark mode does nothing', a: 'Toggle the dark class on <html> — see the useDark() helper on the Theming page.' },
    { q: 'Tags like <s-input> stay unresolved', a: 'Register the plugin, import the component, or configure the resolver — see above.' },
]

const toc = [
    { id: 'install-steps', label: 'Install' },
    { id: 'single', label: 'Single import' },
    { id: 'ondemand', label: 'On-demand' },
    { id: 'prefix', label: 'Custom prefix' },
    { id: 'charts', label: 'Chart peers' },
    { id: 'troubleshooting', label: 'Troubleshooting' },
    { id: 'categories', label: 'Categories' },
    { id: 'quicklook', label: 'Quick look' },
]

const quickCode = `<div class="flex flex-col gap-3">
  <div class="flex items-center gap-2">
    <s-input v-model="text" placeholder="Customer name" />
    <s-button>Save</s-button>
    <s-button variant="secondary">Cancel</s-button>
  </div>
  <div class="flex flex-wrap items-center gap-2">
    <s-tag type="success">Confirmed</s-tag>
    <s-tag type="warning">Pending</s-tag>
    <s-switch v-model="on" aria-label="Notifications" />
    <s-button variant="danger" size="sm">Delete</s-button>
  </div>
</div>`

function go(hash) {
    window.location.hash = hash
}

function scrollToInstall() {
    document.getElementById('install-steps')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style>
.s-hero {
    background: var(--s-surface);
}
.s-hero-grid {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(var(--s-accent-border) 1px, transparent 1px),
        linear-gradient(90deg, var(--s-accent-border) 1px, transparent 1px);
    background-size: 28px 28px;
    opacity: 0.18;
    mask-image: radial-gradient(ellipse 70% 90% at 50% 0%, black 30%, transparent 75%);
}
.s-hero-glow {
    position: absolute;
    width: 420px;
    height: 220px;
    border-radius: 9999px;
    filter: blur(90px);
    pointer-events: none;
}
.s-hero-glow-a {
    top: -120px;
    left: 50%;
    transform: translateX(-80%);
    background: var(--s-accent-subtle);
    opacity: 0.9;
}
.s-hero-glow-b {
    top: -80px;
    left: 50%;
    transform: translateX(30%);
    background: var(--s-accent-border);
    opacity: 0.5;
}
.s-hero-title {
    color: var(--s-text-primary);
    letter-spacing: -0.03em;
}
.s-cat-card:hover {
    border-color: var(--s-accent-border);
    box-shadow: var(--s-shadow-sm);
}
.s-cat-card .s-cat-arrow {
    opacity: 0;
    transform: translateX(-4px);
}
.s-cat-card:hover .s-cat-arrow {
    opacity: 1;
    transform: none;
    color: var(--s-accent-text);
}
@media (prefers-reduced-motion: reduce) {
    .s-logo-tile { animation: none; }
    .s-cat-card .s-cat-arrow { opacity: 1; transform: none; }
}
</style>
