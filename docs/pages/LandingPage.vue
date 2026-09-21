<template>
    <div>
        <header ref="barRef" class="s-land-bar sticky top-0 z-40 transition-all">
            <div class="flex items-center gap-2 h-14 px-4 md:px-8">
                <a href="#/" class="flex items-center gap-2 min-w-0">
                    <span class="s-logo-tile w-7 h-7 rounded-lg s-bg-accent flex items-center justify-center text-white font-bold text-xs flex-shrink-0">S</span>
                    <span class="s-text-primary font-semibold text-sm">Simple UI</span>
                </a>
                <nav class="hidden md:flex items-center gap-1 ml-4 text-sm">
                    <a href="#/docs" class="s-land-link px-2.5 py-1.5 rounded-md s-text-secondary">Docs</a>
                    <a href="#/demo/dashboard" class="s-land-link px-2.5 py-1.5 rounded-md s-text-secondary">Demo</a>
                </nav>
                <span class="flex-1" />
                <s-button size="sm" class="s-shine rounded-full!" @click="go('#/docs')">Get started</s-button>
                <a class="s-focus-ring hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-semibold s-text-secondary border s-border-theme" href="https://github.com/kundancool/simple-ui" target="_blank" rel="noopener">
                    <Github class="w-3.5 h-3.5" />GitHub
                </a>
                <button class="s-focus-ring s-docs-icon-btn w-8 h-8 hidden sm:inline-flex items-center justify-center rounded-md s-text-secondary" :aria-label="dark ? 'Light mode' : 'Dark mode'" @click="toggleDark">
                    <Sun v-if="dark" class="w-4 h-4" />
                    <Moon v-else class="w-4 h-4" />
                </button>
            </div>
        </header>

        <div class="px-4 md:px-8">
            <section class="max-w-4xl mx-auto text-center pt-12 md:pt-20 pb-8">
                <p class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold s-bg-accent-subtle s-text-accent uppercase tracking-wider">
                    <span class="s-live-dot" aria-hidden="true" />Vue 3 · MIT · v{{ version }}
                </p>
                <h1 class="mt-5 font-bold tracking-tight s-hero-title text-5xl md:text-7xl">
                    Simple UI,<br /><span class="s-hero-accent">beautifully</span> fast.
                </h1>
                <p class="mt-5 s-text-secondary max-w-xl mx-auto text-base md:text-xl">
                    {{ count }} themeable components that line up, theme together,
                    and stay accessible — so you ship dashboards, not form rows.
                </p>
                <div class="mt-8 flex flex-wrap justify-center gap-3 s-rise" style="animation-delay: 150ms">
                    <s-button size="lg" class="rounded-full! px-7!" @click="go('#/docs')">Get started</s-button>
                    <s-button size="lg" variant="secondary" class="rounded-full! px-7!" @click="go('#/demo/dashboard')">
                        <Play class="w-4 h-4" />Watch it work
                    </s-button>
                </div>
                <div class="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-xs s-text-muted s-rise" style="animation-delay: 300ms">
                    <span class="inline-flex items-center gap-1.5"><Check class="w-3.5 h-3.5 s-text-success" />MIT licensed</span>
                    <span class="inline-flex items-center gap-1.5"><Check class="w-3.5 h-3.5 s-text-success" />Zero runtime dependencies</span>
                    <span class="inline-flex items-center gap-1.5"><Check class="w-3.5 h-3.5 s-text-success" />Accessible by default</span>
                </div>
                <button type="button" class="s-install-chip mt-6 inline-flex items-center gap-2 px-3 py-2 rounded-lg border s-border-theme s-bg-surface font-mono text-xs md:text-sm s-text-secondary" @click="copyInstall" :title="'Copy: ' + installCmd">
                    <span class="s-text-muted">$</span> {{ installCmd }}
                    <span class="text-[11px] s-text-accent font-sans font-medium inline-flex items-center gap-1">
                        <Copy v-if="!copied" class="w-3 h-3" /><Check v-else class="w-3 h-3" />{{ copied ? 'Copied' : 'Copy' }}
                    </span>
                </button>
            </section>

            <section class="mt-4" aria-label="Product preview">
                <div class="s-shot rounded-2xl border s-border-theme overflow-hidden s-bg-surface">
                    <div class="flex items-center gap-2 px-4 h-11 border-b s-border-theme s-bg-surface-raised">
                        <span class="flex gap-1.5" aria-hidden="true">
                            <span class="w-2.5 h-2.5 rounded-full s-demo-dot-r" />
                            <span class="w-2.5 h-2.5 rounded-full s-demo-dot-y" />
                            <span class="w-2.5 h-2.5 rounded-full s-demo-dot-g" />
                        </span>
                        <span class="flex-1 mx-4 hidden sm:block text-center font-mono text-[11px] s-text-muted truncate">app.acme.test/orders</span>
                        <span class="w-10" aria-hidden="true" />
                    </div>
                    <div class="p-3 md:p-5 s-bg-app">
                        <div class="flex flex-wrap items-start justify-between gap-2 mb-3">
                            <div>
                                <p class="text-base md:text-lg font-semibold s-text-primary">Orders</p>
                                <p class="text-xs s-text-muted">Today at a glance</p>
                            </div>
                            <div class="flex gap-2">
                                <s-button size="sm">+ New order</s-button>
                                <s-button size="sm" variant="secondary">Export</s-button>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                            <s-stat-card :icon="Wallet" bg-color="s-bg-icon-green" icon-color="s-text-icon-green" value="₹48,210" label="Revenue" />
                            <s-stat-card :icon="CalendarCheck" bg-color="s-bg-icon-blue" icon-color="s-text-icon-blue" value="128" label="New orders" />
                            <s-stat-card :icon="Hourglass" bg-color="s-bg-icon-yellow" icon-color="s-text-icon-yellow" value="23" label="Pending" />
                            <s-stat-card :icon="Star" bg-color="s-bg-icon-purple" icon-color="s-text-icon-purple" value="4.8" label="Rating" />
                        </div>
                        <s-data-table :data="shotRows" :stripe="false" size="small" class="mt-2.5">
                            <s-data-table-column prop="no" label="Order" width="100px" />
                            <s-data-table-column prop="customer" label="Customer" />
                            <s-data-table-column label="Status" width="130px">
                                <template #default="{ row }"><s-tag :type="row.status === 'CONFIRMED' ? 'success' : 'warning'" size="sm">{{ row.status }}</s-tag></template>
                            </s-data-table-column>
                            <s-data-table-column prop="total" label="Total" align="right" width="90px" />
                        </s-data-table>
                    </div>
                </div>
                <div class="s-shot-glow" aria-hidden="true" />
            </section>

            <div class="mt-6 border s-border-theme rounded-xl s-bg-surface overflow-hidden">
                <s-marquee aria-label="Component tags" :speed="120">
                    <span v-for="t in marqueeTags" :key="t" class="font-mono text-xs s-text-secondary px-3 py-1 rounded-full border s-border-theme s-bg-surface-raised">&lt;{{ t }}&gt;</span>
                </s-marquee>
            </div>

            <section class="grid grid-cols-3 gap-3 mt-10 text-center">
                <div v-for="s in stats" :key="s.label">
                    <p class="text-3xl md:text-5xl font-bold s-text-primary tracking-tight">{{ s.value }}</p>
                    <p class="text-xs md:text-sm s-text-muted mt-1">{{ s.label }}</p>
                </div>
            </section>

            <section class="mt-20 md:mt-28 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div>
                    <p class="text-[11px] font-semibold uppercase tracking-wider s-text-accent">Theming</p>
                    <h2 class="mt-2 text-2xl md:text-4xl font-bold tracking-tight s-text-primary">One variable.<br />Every shade follows.</h2>
                    <p class="mt-3 s-text-secondary text-sm md:text-base">Subtle fills and borders derive from their base automatically. Override a single token — or flip the whole interface from light to dark with one class.</p>
                    <div class="mt-4 flex gap-2">
                        <s-button size="sm" variant="secondary" @click="go('#/docs/theming')">Theme playground</s-button>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-2.5">
                    <div class="rounded-xl border s-border-theme s-bg-surface p-3">
                        <p class="text-[11px] font-semibold s-text-muted uppercase tracking-wider mb-2">Light</p>
                        <s-button size="sm">Primary</s-button>
                        <div class="flex gap-1.5 mt-2"><s-tag type="success" size="sm">Paid</s-tag><s-tag type="warning" size="sm">Due</s-tag></div>
                    </div>
                    <div class="dark rounded-xl border s-border-theme s-bg-surface p-3">
                        <p class="text-[11px] font-semibold s-text-muted uppercase tracking-wider mb-2">Dark</p>
                        <s-button size="sm">Primary</s-button>
                        <div class="flex gap-1.5 mt-2"><s-tag type="success" size="sm">Paid</s-tag><s-tag type="warning" size="sm">Due</s-tag></div>
                    </div>
                </div>
            </section>

            <section class="mt-20 md:mt-28 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div class="md:order-2">
                    <p class="text-[11px] font-semibold uppercase tracking-wider s-text-accent">Components</p>
                    <h2 class="mt-2 text-2xl md:text-4xl font-bold tracking-tight s-text-primary">Rows that<br />line up.</h2>
                    <p class="mt-3 s-text-secondary text-sm md:text-base">Inputs, selects, date pickers and buttons share one 36px height, one focus language and one validation pattern. No per-page compensation, ever.</p>
                    <div class="mt-4 flex gap-2">
                        <s-button size="sm" variant="secondary" @click="go('#/docs')">Browse all {{ count }}</s-button>
                    </div>
                </div>
                <div class="md:order-1 rounded-xl border s-border-theme s-bg-surface p-4">
                    <div class="flex items-center gap-2">
                        <s-input v-model="demoName" placeholder="Customer name" inline class="flex-1" />
                        <s-button>Save</s-button>
                    </div>
                    <div class="flex items-center gap-2 mt-2.5">
                        <s-select v-model="demoChannel" :options="demoChannels" inline class="flex-1" />
                        <s-date-picker v-model="demoDay" class="flex-1" />
                    </div>
                    <s-data-table :data="shotRows.slice(0, 2)" :stripe="false" size="small" class="mt-2.5">
                        <s-data-table-column prop="customer" label="Customer" />
                        <s-data-table-column prop="total" label="Total" align="right" width="90px" />
                    </s-data-table>
                </div>
            </section>

            <section class="mt-20 md:mt-28 mb-12 md:mb-16 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div>
                    <p class="text-[11px] font-semibold uppercase tracking-wider s-text-accent">AI-native</p>
                    <h2 class="mt-2 text-2xl md:text-4xl font-bold tracking-tight s-text-primary">Describe it.<br />Ship it.</h2>
                    <p class="mt-3 s-text-secondary text-sm md:text-base">A versioned registry, llms.txt and an MCP server mean agents scaffold with correct APIs — dashboards in two prompts.</p>
                    <div class="mt-4 flex gap-2">
                        <s-button size="sm" variant="secondary" @click="go('#/docs/ai')">Build with AI</s-button>
                    </div>
                </div>
                <div class="rounded-xl border s-border-theme s-bg-surface overflow-hidden">
                    <div class="px-4 py-2.5 border-b s-border-theme s-bg-surface-raised">
                        <p class="font-mono text-[11px] s-text-muted">agent — 2 prompts</p>
                    </div>
                    <div class="p-4 font-mono text-xs leading-relaxed">
                        <p><span class="s-text-success">❯</span> <span class="s-text-primary">dashboard with orders table + KPIs</span></p>
                        <p class="s-text-muted mt-1">✓ scaffold · ✓ s-data-table · ✓ s-stat-card</p>
                        <p class="mt-2"><span class="s-text-success">❯</span> <span class="s-text-primary">add revenue chart + dark toggle</span></p>
                        <p class="s-text-muted mt-1">✓ s-line-chart · ✓ useDark()</p>
                    </div>
                </div>
            </section>

            
            
            
            

            

        </div>
        <s-footer
            class="mt-12 md:mt-16"
            brand-name="Simple UI"
            tagline="Themeable Vue 3 components for dashboards and admin apps."
            :columns="footerCols"
            bottom-note="© 2026 Kundan · MIT"
        />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
    ArrowRight, Copy, Check, Github, Sun, Moon, Play,
    Wallet, CalendarCheck, Hourglass, Star,
} from 'lucide-vue-next'
import { SButton } from '@kundancool/simple-ui'
import { SDataTable } from '@kundancool/simple-ui'
import { SDataTableColumn } from '@kundancool/simple-ui'
import { STag } from '@kundancool/simple-ui'
import { SStatCard } from '@kundancool/simple-ui'
import { SInput } from '@kundancool/simple-ui'
import { SSelect } from '@kundancool/simple-ui'
import { SDatePicker } from '@kundancool/simple-ui'
import { SSectionHeading } from '@kundancool/simple-ui'
import { SCta } from '@kundancool/simple-ui'
import { SFooter } from '@kundancool/simple-ui'
import { SMarquee } from '@kundancool/simple-ui'
import { useDark } from '@kundancool/simple-ui'

const props = defineProps({ registry: { type: Object, default: () => ({}) } })

const copied = ref(false)
const demoName = ref('')
const demoChannel = ref('')
const demoDay = ref('')
const version = computed(() => props.registry.version ?? '0.1.0')
const installCmd = computed(() => `npm install ${props.registry.package ?? '@kundancool/simple-ui'}`)
const count = computed(() => props.registry.components?.length ?? 0)
const marqueeTags = computed(() => {
    const tags = (props.registry.components ?? []).map((c) => c.tag)
    return [...tags, ...tags]
})

const stats = computed(() => [
    { value: String(count.value), label: 'components' },
    { value: String(new Set((props.registry.components ?? []).map((c) => c.category)).size), label: 'categories' },
    { value: '40+', label: 'demo pages' },
])

const { isDark: dark, toggle: toggleDark, init } = useDark()
const barRef = ref(null)
onMounted(() => {
    init()
    let scroller = barRef.value?.parentElement
    while (scroller && scroller.scrollHeight <= scroller.clientHeight + 1) {
        scroller = scroller.parentElement
    }
    if (!scroller || !barRef.value) {
        barRef.value?.classList.add('s-land-solid')
        return
    }
    const onScroll = () => barRef.value?.classList.toggle('s-land-solid', scroller.scrollTop > 24)
    onScroll()
    scroller.addEventListener('scroll', onScroll, { passive: true })
})

const shotRows = [
    { no: 'ORD-101', customer: 'Aarav Sharma', status: 'CONFIRMED', total: '₹4,200' },
    { no: 'ORD-102', customer: 'Diya Patel', status: 'PENDING', total: '₹2,800' },
    { no: 'ORD-103', customer: 'Kabir Singh', status: 'CONFIRMED', total: '₹6,100' },
]

const demoChannels = [
    { id: '', name: 'All channels' },
    { id: 'direct', name: 'Direct' },
    { id: 'marketplace', name: 'Marketplace' },
]

const footerCols = [
    { heading: 'Docs', links: [{ label: 'Getting started', to: '#/docs' }, { label: 'Components', to: '#/docs' }, { label: 'Theming', to: '#/docs/theming' }] },
    { heading: 'Demo', links: [{ label: 'Dashboard', to: '#/demo/dashboard' }, { label: 'Pricing', to: '#/demo/pricing' }, { label: 'Blog', to: '#/demo/blog' }] },
]

function go(hash) {
    window.location.hash = hash
}

async function copyInstall() {
    try {
        await navigator.clipboard.writeText(installCmd.value)
    } catch {
        // ignore
    }
    copied.value = true
    setTimeout(() => {
        copied.value = false
    }, 1500)
}
</script>

<style>
.s-land-bar {
    background-color: transparent;
}
.s-land-bar.s-land-solid {
    background-color: var(--s-surface);
    border-color: var(--s-border);
    box-shadow: var(--s-shadow-sm);
}
.s-land-link {
    position: relative;
}
.s-land-link:hover {
    color: var(--s-text-primary);
    background-color: var(--s-surface-raised);
}
.s-land-link::after {
    content: '';
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 4px;
    height: 2px;
    border-radius: 2px;
    background-color: var(--s-accent-text);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform var(--s-duration-fast) var(--s-ease-out);
}
.s-land-link:hover::after {
    transform: scaleX(1);
}
.s-logo-tile {
    transition: transform var(--s-duration-base) var(--s-ease-out), box-shadow var(--s-duration-base) var(--s-ease-out);
}
a:hover .s-logo-tile {
    transform: rotate(-8deg) scale(1.06);
    box-shadow: var(--s-shadow-md);
}
.s-shine {
    position: relative;
    overflow: hidden;
}
.s-shine::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 40%;
    left: -60%;
    background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.35), transparent);
    animation: s-shine 3.2s ease-in-out infinite;
}
@keyframes s-shine {
    0% { left: -60%; }
    55%, 100% { left: 130%; }
}
.s-rise {
    opacity: 0;
    animation: s-rise 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
}
@keyframes s-rise {
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: none; }
}
.s-hero-title {
    color: var(--s-text-primary);
    letter-spacing: -0.035em;
}
.s-hero-accent {
    background: linear-gradient(100deg, var(--s-accent-text), var(--s-accent-text-hover, var(--s-accent-text)));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}
.s-live-dot {
    width: 7px;
    height: 7px;
    border-radius: 9999px;
    background-color: var(--s-success);
    box-shadow: 0 0 0 3px var(--s-success-subtle);
    animation: s-live-pulse 2s ease-in-out infinite;
}
@keyframes s-live-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.45; }
}
.s-shot {
    box-shadow: var(--s-shadow-lg);
}
.s-shot-glow {
    height: 120px;
    margin: 0 8%;
    background: radial-gradient(ellipse at center, var(--s-accent-subtle), transparent 70%);
    filter: blur(10px);
}
.s-demo-dot-r { background-color: #ff5f57; }
.s-demo-dot-y { background-color: #febc2e; }
.s-demo-dot-g { background-color: #28c840; }
@media (prefers-reduced-motion: reduce) {
    .s-live-dot { animation: none; }
    .s-shine::after { animation: none; }
    .s-rise { animation: none; opacity: 1; }
}
</style>
