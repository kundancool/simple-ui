<template>
    <div class="flex h-screen overflow-hidden s-bg-app">
        <s-sidebar
            v-if="showSidebar || isDemo"
            :open="sidebarOpen"
            :width="288"
            @update:open="setSidebar"
        >
            <template #brand>
                <a href="#/" class="flex items-center gap-2.5 min-w-0">
                    <span class="s-logo-tile w-8 h-8 rounded-lg s-bg-accent flex items-center justify-center text-white font-bold text-sm flex-shrink-0">S</span>
                    <span class="min-w-0 leading-tight">
                        <span class="block s-text-primary font-semibold text-sm truncate">Simple UI</span>
                        <span class="block s-text-muted font-normal text-[11px]">v{{ version }}</span>
                    </span>
                </a>
            </template>
            <template v-if="isDemo">
                <nav class="flex-1 overflow-y-auto p-3 space-y-4 text-sm">
                    <div>
                        <a href="#/docs" class="s-docs-link flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] s-text-secondary">
                            <BookOpen class="w-4 h-4 flex-shrink-0" />
                            <span class="truncate">Docs</span>
                        </a>
                    </div>
                    <div v-for="group in demoGroups" :key="group.category">
                        <button type="button" class="w-full flex items-center gap-3 px-3 py-2 mb-0.5 text-[11px] font-semibold uppercase tracking-wider s-text-muted rounded-lg s-menu-section" @click="toggleGroup('demo:' + group.category)" :aria-expanded="!collapsed['demo:' + group.category]">
                            <span class="truncate">{{ group.category }}</span>
                            <span class="font-normal normal-case tracking-normal opacity-70">{{ group.items.length }}</span>
                            <ChevronDown class="w-4 h-4 ml-auto flex-shrink-0 transition-transform duration-200" :class="collapsed['demo:' + group.category] ? '-rotate-90' : ''" />
                        </button>
                        <div
                            class="grid transition-[grid-template-rows] duration-200 ease-out"
                            :style="{ gridTemplateRows: collapsed['demo:' + group.category] ? '0fr' : '1fr' }"
                        >
                            <div class="overflow-hidden">
                                <div class="ml-3 pl-3 border-l s-border-theme space-y-0.5">
                                    <a v-for="l in group.items" :key="l.hash" :href="l.hash" class="s-docs-link flex items-center gap-3 px-3 py-2 rounded-lg text-[13px]" :class="isActive(l.hash) ? 's-bg-accent-subtle s-text-accent font-medium' : 's-text-secondary'">
                                        <component :is="l.icon" class="w-4 h-4 flex-shrink-0" />
                                        <span class="truncate">{{ l.label }}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </template>
            <template v-else>
                <nav class="flex-1 overflow-y-auto p-3 space-y-4 text-sm">
                <div>
                    <p class="px-2 mb-1 text-[11px] font-semibold uppercase tracking-wider s-text-muted">Guide</p>
                    <a v-for="l in guideLinks" :key="l.hash" :href="l.hash" class="s-docs-link flex items-center gap-2 px-2 py-1.5 rounded-md" :class="isActive(l.hash) ? 's-bg-accent-subtle s-text-accent font-medium' : 's-text-secondary'">
                        <component :is="l.icon" class="w-3.5 h-3.5 flex-shrink-0" />
                        {{ l.label }}
                    </a>
                </div>
                <div v-for="group in groups" :key="group.category">
                    <button type="button" class="w-full flex items-center gap-3 px-3 py-2 mb-0.5 text-[11px] font-semibold uppercase tracking-wider s-text-muted rounded-lg s-menu-section" @click="toggleGroup(group.category)" :aria-expanded="!collapsed[group.category]">
                        <component :is="categoryIcon(group.category)" class="w-5 h-5 flex-shrink-0" />
                        <span class="truncate">{{ group.category }}</span>
                        <span class="font-normal normal-case tracking-normal opacity-70">{{ group.items.length }}</span>
                        <ChevronDown class="w-4 h-4 ml-auto flex-shrink-0 transition-transform duration-200" :class="collapsed[group.category] ? '-rotate-90' : ''" />
                    </button>
                    <div
                        class="grid transition-[grid-template-rows] duration-200 ease-out"
                        :style="{ gridTemplateRows: collapsed[group.category] ? '0fr' : '1fr' }"
                    >
                        <div class="overflow-hidden">
                            <div class="ml-3 pl-3 border-l s-border-theme space-y-0.5">
                                <a v-for="c in group.items" :key="c.name" :href="`#/docs/components/${c.dir}`" class="s-docs-link flex items-center px-3 py-2 rounded-lg text-[13px]" :class="isActive(`#/docs/components/${c.dir}`) ? 's-bg-accent-subtle s-text-accent font-medium' : 's-text-secondary'" :title="`<${c.tag}> — ${c.description}`">
                                    <span class="truncate">{{ c.name }}</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                </nav>
            </template>
            <template #footer>
                <template v-if="isDemo">
                    <p class="px-1 text-[11px] s-text-muted">Interactive previews — every control works.</p>
                </template>
                <template v-else>
                    <p class="px-1 text-[11px] s-text-muted">Simple UI v{{ version }} · MIT · by Kundan</p>
                    <p class="px-1 text-[11px] flex items-center gap-3">
                        <a class="s-text-accent inline-flex items-center gap-1" href="https://github.com/kundancool/simple-ui" target="_blank" rel="noopener"><Github class="w-3 h-3" />GitHub</a>
                        <a class="s-text-accent" href="#/docs/ai">Build with AI</a>
                    </p>
                </template>
            </template>
        </s-sidebar>

        <div class="flex-1 flex flex-col min-w-0">
            <header v-if="isDemo" class="h-16 flex-shrink-0 flex items-center gap-2 px-3 md:px-6 s-bg-surface border-b s-border-theme">
                <button v-if="!sidebarOpen" class="s-focus-ring inline-flex items-center justify-center w-8 h-8 rounded-md s-text-secondary" aria-label="Open sidebar" @click="setSidebar(true)">
                    <Menu class="w-5 h-5" />
                </button>
                <div class="min-w-0 flex-1">
                    <s-breadcrumb :items="crumbs" />
                </div>
                <button class="s-focus-ring s-docs-icon-btn w-8 h-8 flex items-center justify-center rounded-md s-text-secondary" :aria-label="dark ? 'Light mode' : 'Dark mode'" @click="toggleDark">
                    <Sun v-if="dark" class="w-4 h-4" />
                    <Moon v-else class="w-4 h-4" />
                </button>
            </header>
            <header v-else-if="showSidebar" class="h-16 flex-shrink-0 flex items-center gap-2 px-3 md:px-6 s-bg-surface border-b s-border-theme">
                <button v-if="!sidebarOpen" class="s-focus-ring inline-flex items-center justify-center w-8 h-8 rounded-md s-text-secondary" aria-label="Open sidebar" @click="setSidebar(true)">
                    <Menu class="w-5 h-5" />
                </button>
                <div v-if="route !== '/'" class="min-w-0 flex-1">
                    <s-breadcrumb :items="crumbs" />
                </div>
                <span v-else class="min-w-0 flex-1" />
                <div class="flex items-center gap-2 flex-shrink-0">
                    <button
                        type="button"
                        class="s-focus-ring s-palette-trigger hidden sm:inline-flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-md text-xs s-text-muted border s-border-input s-bg-surface-raised transition-colors"
                        @click="paletteRef?.open()"
                    >
                        <Search class="w-3.5 h-3.5" />
                        Search…
                        <kbd class="inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium s-text-muted s-bg-surface rounded border s-border-theme">⌘K</kbd>
                    </button>
                    <button
                        type="button"
                        class="s-focus-ring s-palette-trigger sm:hidden w-8 h-8 inline-flex items-center justify-center rounded-md s-text-muted border s-border-input s-bg-surface-raised transition-colors"
                        aria-label="Search"
                        @click="paletteRef?.open()"
                    >
                        <Search class="w-4 h-4" />
                    </button>
                    <button class="s-focus-ring s-docs-icon-btn w-8 h-8 flex items-center justify-center rounded-md s-text-secondary" :aria-label="dark ? 'Light mode' : 'Dark mode'" @click="toggleDark">
                        <Sun v-if="dark" class="w-4 h-4" />
                        <Moon v-else class="w-4 h-4" />
                    </button>
                </div>
            </header>
            <main ref="mainRef" class="flex-1 overflow-y-auto">
                <div :class="isLanding ? 'w-full' : 'px-4 md:px-8 py-6 md:py-10 w-full'">
                    <Transition name="s-fade-slide" mode="out-in">
                        <div :key="route">
                            <component :is="page" :registry="registry" :route="route" />
                        </div>
                    </Transition>
                </div>
            </main>
        </div>
        <s-search-palette ref="paletteRef" v-model="paletteOpen" :items="paletteItems" :show-trigger="false" placeholder="Search pages and components…" @select="goPalette" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import {
    Search, Menu, X, Sun, Moon, ChevronDown, Github, BookOpen, Tag, Settings,
    Blocks,
    LogIn, List, Users, FileText, KeyRound, MailCheck, UserPlus, ClipboardList,
    ClipboardCheck, UserCog, GraduationCap, KanbanSquare, ShoppingBag, ShieldCheck,
    KeySquare, ScrollText, Receipt, ShoppingCart, MessageSquare, MessagesSquare,
    Bell, CircleHelp, Newspaper, Map as MapIcon, CreditCard, Inbox, Folder, CalendarDays, Star, MonitorSmartphone,
    Wallet, Webhook,
    LayoutGrid, Palette, Bot, LayoutDashboard,
    MousePointerClick, TextCursorInput, Table2, BellRing, Compass, PanelLeft, ChartColumn,
} from 'lucide-vue-next'
import { useDark } from '@kundancool/simple-ui'
import { CATEGORY_ORDER } from './categories'
import { SSearchPalette } from '@kundancool/simple-ui'
import { SBreadcrumb } from '@kundancool/simple-ui'
import { SSidebar } from '@kundancool/simple-ui'
import HomePage from './pages/HomePage.vue'
import LandingPage from './pages/LandingPage.vue'
import ThemingPage from './pages/ThemingPage.vue'
import AIPage from './pages/AIPage.vue'
import ComponentPage from './pages/ComponentPage.vue'

const demoModules = import.meta.glob('./pages/demo/*.vue', { eager: true })

function demoSlug(path) {
    return path
        .split('/')
        .pop()
        .replace(/\.vue$/, '')
        .replace(/^Demo/, '')
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase()
}

const demoBySlug = Object.fromEntries(
    Object.entries(demoModules).map(([path, mod]) => [demoSlug(path), mod.default]),
)

const registry = ref({ components: [], version: '0.1.0' })
const hash = ref(window.location.hash || '#/')
const paletteRef = ref(null)
const paletteOpen = ref(false)
const collapsed = ref({})
const mainRef = ref(null)
const { isDark: dark, toggle: toggleDark, init } = useDark()

const isMobile = ref(typeof window !== 'undefined' ? window.innerWidth < 768 : false)
const sidebarOpen = ref(typeof window === 'undefined' ? true : window.innerWidth >= 768)

function setSidebar(value) {
    sidebarOpen.value = value
    try {
        localStorage.setItem('s-docs-sidebar', value ? 'open' : 'closed')
    } catch {
        // private mode — session default stands
    }
}

function onResize() {
    isMobile.value = window.innerWidth < 768
}

const guideLinks = [
    { hash: '#/docs', label: 'Introduction', icon: LayoutGrid },
    { hash: '#/docs/theming', label: 'Theming', icon: Palette },
    { hash: '#/docs/ai', label: 'Build with AI', icon: Bot },
]

const demoLinks = [
    // Dashboards
    { hash: '#/demo/dashboard', label: 'Overview', icon: LayoutDashboard, category: 'Dashboards' },
    { hash: '#/demo/analytics', label: 'Analytics', icon: ChartColumn, category: 'Dashboards' },
    { hash: '#/demo/reports', label: 'Reports', icon: FileText, category: 'Dashboards' },
    // Auth
    { hash: '#/demo/login', label: 'Sign in', icon: LogIn, category: 'Auth' },
    { hash: '#/demo/forgot-password', label: 'Forgot password', icon: KeyRound, category: 'Auth' },
    { hash: '#/demo/verify-email', label: 'Verify email', icon: MailCheck, category: 'Auth' },
    { hash: '#/demo/invite-team', label: 'Accept invite', icon: UserPlus, category: 'Auth' },
    // Store
    { hash: '#/demo/products', label: 'Products', icon: ShoppingBag, category: 'Store' },
    { hash: '#/demo/orders', label: 'Orders', icon: Receipt, category: 'Store' },
    { hash: '#/demo/cart', label: 'Cart', icon: ShoppingCart, category: 'Store' },
    { hash: '#/demo/checkout', label: 'Checkout', icon: CreditCard, category: 'Store' },
    { hash: '#/demo/invoice', label: 'Invoice', icon: FileText, category: 'Store' },
    // Team
    { hash: '#/demo/crud', label: 'Team', icon: Users, category: 'Team' },
    { hash: '#/demo/roles', label: 'Roles & permissions', icon: ShieldCheck, category: 'Team' },
    { hash: '#/demo/sessions', label: 'Sessions & devices', icon: MonitorSmartphone, category: 'Team' },
    // Engage
    { hash: '#/demo/inbox', label: 'Inbox', icon: Inbox, category: 'Engage' },
    { hash: '#/demo/comments', label: 'Comments', icon: MessageSquare, category: 'Engage' },
    { hash: '#/demo/chat', label: 'Chat', icon: MessagesSquare, category: 'Engage' },
    { hash: '#/demo/notifications', label: 'Notifications', icon: Bell, category: 'Engage' },
    { hash: '#/demo/testimonials', label: 'Testimonials', icon: Star, category: 'Engage' },
    // Organize
    { hash: '#/demo/listing', label: 'Orders', icon: List, category: 'Organize' },
    { hash: '#/demo/activity', label: 'Activity', icon: Bell, category: 'Organize' },
    { hash: '#/demo/kanban', label: 'Kanban', icon: KanbanSquare, category: 'Organize' },
    { hash: '#/demo/calendar', label: 'Calendar', icon: CalendarDays, category: 'Organize' },
    { hash: '#/demo/search-results', label: 'Search results', icon: Search, category: 'Organize' },
    { hash: '#/demo/file-manager', label: 'Files', icon: Folder, category: 'Organize' },
    // Configure
    { hash: '#/demo/settings', label: 'Settings', icon: Settings, category: 'Configure' },
    { hash: '#/demo/billing', label: 'Billing', icon: Wallet, category: 'Configure' },
    { hash: '#/demo/api-keys', label: 'API keys', icon: KeySquare, category: 'Configure' },
    { hash: '#/demo/audit-log', label: 'Audit log', icon: ScrollText, category: 'Configure' },
    { hash: '#/demo/webhooks', label: 'Webhooks', icon: Webhook, category: 'Configure' },
    { hash: '#/demo/integrations', label: 'Integrations', icon: Blocks, category: 'Configure' },
    // Build
    { hash: '#/demo/wizard', label: 'Order wizard', icon: ClipboardList, category: 'Build' },
    { hash: '#/demo/survey', label: 'Survey', icon: ClipboardCheck, category: 'Build' },
    { hash: '#/demo/profile-editor', label: 'Profile editor', icon: UserCog, category: 'Build' },
    { hash: '#/demo/onboarding', label: 'Onboarding', icon: GraduationCap, category: 'Build' },
    // Inform
    { hash: '#/demo/pricing', label: 'Pricing', icon: Tag, category: 'Inform' },
    { hash: '#/demo/faq', label: 'FAQ', icon: CircleHelp, category: 'Inform' },
    { hash: '#/demo/changelog', label: 'Changelog', icon: Newspaper, category: 'Inform' },
    { hash: '#/demo/roadmap', label: 'Roadmap', icon: MapIcon, category: 'Inform' },
    { hash: '#/demo/blog', label: 'Blog', icon: Newspaper, category: 'Inform' },
]

const DEMO_CATEGORIES = ['Dashboards', 'Auth', 'Store', 'Team', 'Engage', 'Organize', 'Configure', 'Build', 'Inform']

const demoGroups = computed(() =>
    DEMO_CATEGORIES.map((category) => ({
        category,
        items: demoLinks.filter((l) => l.category === category),
    })).filter((g) => g.items.length > 0),
)

const CATEGORY_ICONS = {
    Basic: MousePointerClick,
    Form: TextCursorInput,
    Data: Table2,
    Feedback: BellRing,
    Navigation: Compass,
    Layout: PanelLeft,
    Charts: ChartColumn,
}

function categoryIcon(cat) {
    return CATEGORY_ICONS[cat] ?? LayoutGrid
}

const components = computed(() => registry.value.components ?? [])
const version = computed(() => registry.value.version ?? '')

const groups = computed(() => {
    const byCat = new Map()
    for (const c of components.value) {
        const cat = c.category || 'Others'
        if (!byCat.has(cat)) {
            byCat.set(cat, [])
        }
        byCat.get(cat).push(c)
    }
    const ordered = CATEGORY_ORDER.filter((cat) => byCat.has(cat)).map((cat) => ({ category: cat, items: byCat.get(cat) }))
    for (const [cat, items] of byCat) {
        if (!CATEGORY_ORDER.includes(cat)) {
            ordered.push({ category: cat, items })
        }
    }
    return ordered
})

function goPalette(item) {
    if (item.to) {
        window.location.hash = item.to
    }
}

const paletteItems = computed(() => [
    ...guideLinks.map((l) => ({ label: l.label, hint: 'Guide', to: l.hash, icon: l.icon })),
    ...demoLinks.map((l) => ({ label: l.label, hint: 'Demo page', to: l.hash, icon: l.icon, keywords: 'demo example' })),
    ...components.value.map((c) => ({
        label: c.name,
        hint: `${c.category} · <${c.tag}>`,
        to: `#/docs/components/${c.dir}`,
        keywords: `${c.tag} ${c.category} ${c.description}`,
    })),
])

function toggleGroup(cat) {
    collapsed.value[cat] = !collapsed.value[cat]
}

const route = computed(() => hash.value.replace(/^#/, '') || '/')
const isLanding = computed(() => route.value === '/')
const isDemo = computed(() => route.value.startsWith('/demo/'))
const showSidebar = computed(() => !isLanding.value && !isDemo.value)

const crumbs = computed(() => {
    if (route.value === '/') {
        return []
    }
    const guide = [...guideLinks, ...demoLinks].find((l) => l.hash === `#${route.value}`)
    if (guide) {
        const demo = demoLinks.includes(guide)
        if (demo) {
            const firstInCategory = demoLinks.find((l) => l.category === guide.category)
            return [
                { label: 'Demo', to: '#/demo/dashboard' },
                { label: guide.category, to: firstInCategory?.hash ?? '#/demo/dashboard' },
                { label: guide.label },
            ]
        }
        return [{ label: 'Guides', to: '#/docs' }, { label: guide.label }]
    }
    const match = route.value.match(/\/components\/(.+)$/)
    if (match) {
        const hit = components.value.find((c) => c.dir === match[1])
        if (hit) {
            return [{ label: 'Components', to: '#/docs' }, { label: hit.category, to: '#/docs' }, { label: hit.name }]
        }
    }
    return [{ label: 'Simple UI' }]
})

const page = computed(() => {
    const r = route.value
    if (r === '/') {
        return LandingPage
    }
    if (r === '/docs') {
        return HomePage
    }
    if (r === '/docs/theming') {
        return ThemingPage
    }
    if (r === '/docs/ai') {
        return AIPage
    }
    if (r.startsWith('/docs/components/')) {
        return ComponentPage
    }
    if (r.startsWith('/demo/')) {
        return demoBySlug[r.slice('/demo/'.length)] ?? HomePage
    }
    return HomePage
})

function isActive(h) {
    return hash.value === h || (!hash.value && h === '#/')
}

function onHash() {
    hash.value = window.location.hash || '#/'
    if (isMobile.value) {
        setSidebar(false)
    }
    nextTick(() => {
        if (typeof mainRef.value?.scrollTo === 'function') {
            mainRef.value.scrollTo({ top: 0 })
        }
    })
}

onMounted(async () => {
    init()
    try {
        if (localStorage.getItem('s-docs-sidebar') === 'closed') {
            sidebarOpen.value = false
        }
    } catch {
        // private mode — session default stands
    }
    window.addEventListener('hashchange', onHash)
    window.addEventListener('resize', onResize)
    try {
        const res = await fetch('registry.json')
        registry.value = await res.json()
    } catch {
        // registry unavailable — nav falls back to empty
    }
})
onBeforeUnmount(() => {
    window.removeEventListener('hashchange', onHash)
    window.removeEventListener('resize', onResize)
})
</script>

<style>
.s-land-link:hover {
    color: var(--s-text-primary);
    background-color: var(--s-surface-raised);
}
.s-docs-link:hover {
    background-color: var(--s-surface-raised);
    color: var(--s-text-primary);
}
.s-docs-link.s-bg-accent-subtle:hover {
    background-color: var(--s-accent-subtle);
    color: var(--s-accent-text-hover);
}
.s-docs-icon-btn:hover {
    background-color: var(--s-surface-raised);
    color: var(--s-text-primary);
}
.s-palette-trigger:hover {
    border-color: var(--s-accent-border);
    color: var(--s-text-primary);
}
.s-bg-border-theme {
    background-color: var(--s-border);
}
.s-logo-tile {
    animation: s-logo-in 500ms cubic-bezier(0.22, 0.61, 0.36, 1) backwards;
}
@keyframes s-logo-in {
    from { opacity: 0; transform: scale(0.7) rotate(-8deg); }
    to { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
    .s-logo-tile { animation: none; }
}
</style>
