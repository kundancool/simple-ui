<template>
    <div class="grid xl:grid-cols-[minmax(0,1fr)_200px] gap-8 items-start">
        <div class="min-w-0">
        <h1 class="text-2xl font-bold s-text-primary">Theming</h1>
        <p class="text-sm s-text-secondary mt-2 max-w-2xl">
            Every visual decision flows from <span class="font-mono">--s-*</span> variables. Subtle and border
            shades derive from their base via <span class="font-mono">color-mix()</span>, so overriding one
            base color re-themes the whole family. Try it live:
        </p>

        <s-card title="Playground" class="mt-4">
            <div class="grid sm:grid-cols-2 gap-3">
                <label v-for="t in tokens" :key="t.key" class="flex items-center justify-between gap-3 text-sm s-text-secondary">
                    <span class="font-mono text-[13px] inline-flex items-center gap-2">
                        <span class="w-4 h-4 rounded border s-border-theme inline-block" :style="{ backgroundColor: `var(--s-${t.key})` }" />--s-{{ t.key }}
                    </span>
                    <input type="color" :value="t.value" class="w-10 h-8 cursor-pointer bg-transparent border s-border-theme rounded" @input="set(t.key, $event.target.value)" />
                </label>
            </div>
            <div class="flex flex-wrap items-center gap-2 mt-4">
                <s-button>Primary</s-button>
                <s-button variant="danger">Danger</s-button>
                <s-tag type="success">Confirmed</s-tag>
                <s-alert variant="warning" class="w-full">Live preview follows your tokens.</s-alert>
                <s-button variant="secondary" @click="reset">Reset theme</s-button>
                <s-button variant="ghost" @click="toggleDark">
                    <Moon v-if="dark" class="w-4 h-4" /><Sun v-else class="w-4 h-4" />
                    {{ dark ? 'Light mode' : 'Dark mode' }}
                </s-button>
            </div>
        </s-card>

        <h2 id="tokens" class="text-lg font-semibold s-text-primary mt-10 mb-3 scroll-mt-20">Token reference</h2>
        <p class="text-sm s-text-secondary mb-2">Swatches update live with the playground above.</p>
        <s-data-table :data="tokenRows" :stripe="false" size="small" border>
            <s-data-table-column prop="token" label="Token" width="220px">
                <template #default="{ row }"><code class="font-mono text-[12px] s-text-accent">{{ row.token }}</code></template>
            </s-data-table-column>
            <s-data-table-column label="Swatch" width="90px">
                <template #default="{ row }">
                    <span class="inline-block w-8 h-5 rounded border s-border-theme" :style="{ backgroundColor: `var(${row.token})` }" />
                </template>
            </s-data-table-column>
            <s-data-table-column prop="role" label="Role" />
        </s-data-table>

        <h2 id="css" class="text-lg font-semibold s-text-primary mt-10 mb-3 scroll-mt-20">CSS override</h2>
        <DemoBlock title="Your stylesheet" :code="cssCode" lang="css" />

        <h2 id="runtime" class="text-lg font-semibold s-text-primary mt-10 mb-3 scroll-mt-20">Runtime API</h2>
        <DemoBlock title="main.js" :code="runtimeCode" lang="js" />

        <h2 id="scoped" class="text-lg font-semibold s-text-primary mt-10 mb-3 scroll-mt-20">Scoped themes</h2>
        <p class="text-sm s-text-secondary mb-2 max-w-2xl">Pass an element to scope overrides to one subtree — handy for embedded widgets or per-brand panels.</p>
        <DemoBlock title="js" :code="scopedCode" lang="js" />

        <h2 id="dark" class="text-lg font-semibold s-text-primary mt-10 mb-3 scroll-mt-20">Dark mode</h2>
        <p class="text-sm s-text-secondary mb-2">Toggle the <span class="font-mono">dark</span> class on <span class="font-mono">&lt;html&gt;</span> to switch the whole library between its light and dark palettes.</p>
        <DemoBlock title="js" :code="darkCode" lang="js" />

        <h2 id="foundations" class="text-lg font-semibold s-text-primary mt-10 mb-3 scroll-mt-20">Design foundations</h2>
        <p class="text-sm s-text-secondary mb-2 max-w-2xl">One 4px base unit, theme tokens everywhere, both palettes avoiding pure white and black. The specimens below render live from the same tokens.</p>

        <h3 class="text-sm font-semibold s-text-primary mt-6 mb-2">Spacing</h3>
        <DemoCard :code="spacingCode" title="Spacing.vue">
            <s-input v-model="demo" label="Customer name" hint="Label 6px above, hint 4px below, 16px before the next field." />
            <s-input v-model="demo2" label="Phone" error="Enter a valid phone number." />
        </DemoCard>

        <h3 class="text-sm font-semibold s-text-primary mt-6 mb-2">Typography</h3>
        <DemoCard :code="typeCode" title="Type.vue">
            <h1 class="text-lg sm:text-xl font-semibold s-text-primary">Page title</h1>
            <p class="text-sm s-text-secondary mt-0.5">Supporting subtitle line.</p>
            <p class="text-xs font-medium uppercase tracking-wider s-text-muted mt-3">Eyebrow label</p>
            <p class="text-sm s-text-primary mt-1">Body text with a <s-tag size="sm">badge</s-tag> inline.</p>
        </DemoCard>

        <h3 class="text-sm font-semibold s-text-primary mt-6 mb-2">Radius</h3>
        <DemoCard :code="radiusCode" title="Radius.vue">
            <div class="flex flex-wrap items-end gap-3">
                <span class="s-radius-spec rounded" /> <span class="s-radius-spec rounded-md" />
                <span class="s-radius-spec rounded-lg" /> <span class="s-radius-spec rounded-xl" />
                <span class="s-radius-spec rounded-2xl" /> <span class="s-radius-spec rounded-full" />
            </div>
            <p class="text-xs s-text-muted mt-2 font-mono">4 · 6 · 8 · 12 · 16 · full — controls → cards → dialogs → pills</p>
        </DemoCard>

        <h3 class="text-sm font-semibold s-text-primary mt-6 mb-2">Elevation</h3>
        <DemoCard :code="elevationCode" title="Elevation.vue">
            <div class="flex flex-wrap gap-3">
                <div class="s-elev-spec s-shadow-xs-theme rounded-md">xs</div>
                <div class="s-elev-spec s-shadow-sm-theme rounded-md">sm</div>
                <div class="s-elev-spec s-shadow-md-theme rounded-md">md</div>
                <div class="s-elev-spec s-shadow-lg-theme rounded-md">lg</div>
            </div>
            <p class="text-xs s-text-muted mt-2">sm cards and inputs · md hovers · lg overlays. Overlay order: dropdown 100 · dialog 200 · toast 300.</p>
        </DemoCard>

        <h3 class="text-sm font-semibold s-text-primary mt-6 mb-2">Motion</h3>
        <DemoCard :code="motionCode" title="Motion.vue">
            <div class="flex flex-wrap items-center gap-2">
                <s-button size="sm" @click="showDialog = true">Open dialog</s-button>
                <s-button size="sm" variant="secondary" @click="fireToast">Fire toast</s-button>
                <s-hover-popover placement="bottom">
                    <s-tag type="info">Hover me</s-tag>
                    <template #content><p class="text-sm">Popovers fade and scale from their trigger.</p></template>
                </s-hover-popover>
            </div>
            <p class="text-xs s-text-muted mt-2">120ms hovers · 180ms enter/leave · 260ms panels. Reduced-motion short-circuits to near-zero.</p>
            <s-dialog v-model="showDialog" title="Motion specimen" width="sm">
                <p class="text-sm s-text-secondary">Dialogs fade the scrim and pop the panel.</p>
                <template #footer><s-button size="sm" @click="showDialog = false">Done</s-button></template>
            </s-dialog>
            <s-toast-container />
        </DemoCard>

        <h3 class="text-sm font-semibold s-text-primary mt-6 mb-2">Focus & touch</h3>
        <DemoCard :code="focusCode" title="Focus.vue">
            <div class="flex flex-wrap items-center gap-3">
                <s-button size="sm" variant="secondary">Tab to me</s-button>
                <s-switch v-model="sw" aria-label="Focus demo switch" />
                <s-input v-model="demo3" placeholder="Focus ring input" />
            </div>
            <p class="text-xs s-text-muted mt-2">Fields: border + 3px ring. Buttons: 2px outline on keyboard focus only. Hit areas ≥ 24px.</p>
        </DemoCard>

        <h3 class="text-sm font-semibold s-text-primary mt-6 mb-2">States</h3>
        <DemoCard :code="statesCode" title="States.vue">
            <div class="grid sm:grid-cols-3 gap-3">
                <div><p class="text-xs font-medium s-text-secondary mb-1">Loading</p><s-skeleton :lines="2" /></div>
                <div><p class="text-xs font-medium s-text-secondary mb-1">Empty</p><s-data-table :data="[]" empty-text="No orders yet" /></div>
                <div><p class="text-xs font-medium s-text-secondary mb-1">Error</p><s-input v-model="demo4" label="Email" error="Enter a valid email." /></div>
            </div>
        </DemoCard>
        </div>
        <aside class="hidden xl:block sticky top-20 w-50">
            <s-toc :items="toc" />
        </aside>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Moon, Sun } from 'lucide-vue-next'
import DemoBlock from '../DemoBlock.vue'
import DemoCard from '../DemoCard.vue'
import { SButton } from '@kundancool/simple-ui'
import { STag } from '@kundancool/simple-ui'
import { SCard } from '@kundancool/simple-ui'
import { SAlert } from '@kundancool/simple-ui'
import { SDataTable } from '@kundancool/simple-ui'
import { SDataTableColumn } from '@kundancool/simple-ui'
import { SInput } from '@kundancool/simple-ui'
import { SSwitch } from '@kundancool/simple-ui'
import { SDialog } from '@kundancool/simple-ui'
import { SHoverPopover } from '@kundancool/simple-ui'
import { SToastContainer } from '@kundancool/simple-ui'
import { SSkeleton } from '@kundancool/simple-ui'
import { useDark, setTheme, useToast } from '@kundancool/simple-ui'
import { SToc } from '@kundancool/simple-ui'

const props = defineProps({ registry: { type: Object, default: () => ({}) } })
const name = computed(() => props.registry.package ?? '@kundancool/simple-ui')
const runtimeCode = computed(() => `import { setTheme, setPrimary } from '${name.value}'\n\nsetPrimary('#7c3aed')\nsetTheme({ accent: '#7c3aed', danger: '#dc2626' })`)
const cssCode = `:root {\n  --s-accent: #7c3aed; /* everything accent-derived follows */\n}`
const scopedCode = `import { setTheme } from '${name.value}'\n\nsetTheme({ accent: '#0e7490' }, document.querySelector('#widget'))`
const darkCode = `import { useDark } from '${name.value}'\n\nconst { toggle, init } = useDark()\ninit() // respect prefers-color-scheme\ntoggle()`

const spacingCode = `<s-input v-model="name" label="Customer name" hint="…" />\n<s-input v-model="phone" label="Phone" error="…" />`
const typeCode = `<h1 class="text-lg sm:text-xl font-semibold s-text-primary">Page title</h1>\n<p class="text-sm s-text-secondary">Subtitle.</p>\n<p class="text-xs font-medium uppercase tracking-wider s-text-muted">Eyebrow</p>`
const radiusCode = `rounded → rounded-md → rounded-lg → rounded-xl → rounded-2xl → rounded-full\ncontrols   cards/popovers  dialogs   pills`
const elevationCode = `s-shadow-xs-theme · s-shadow-sm-theme · s-shadow-md-theme · s-shadow-lg-theme\noverlays: dropdown 100 · dialog 200 · toast 300`
const motionCode = `120ms hovers · 180ms enter/leave · 260ms panels\n<s-dialog> fades + pops · toasts slide from the edge`
const focusCode = `Fields: border + 3px ring · buttons: 2px outline on :focus-visible\ncomposite controls ring the wrapper (:focus-within)`
const statesCode = `<s-skeleton :lines="2" />           ← loading reserves space\n<s-data-table :data="[]" />          ← muted empty sentence\n<s-input error="…" />                ← error replaces hint, role="alert"`

const { isDark: dark, toggle: toggleDark } = useDark()
const { info } = useToast()

const demo = ref('')
const demo2 = ref('')
const demo3 = ref('')
const demo4 = ref('')
const sw = ref(true)
const showDialog = ref(false)

function fireToast() {
    info('Motion specimen toast')
}

const tokens = ref([
    { key: 'accent', value: '#0c7076' },
    { key: 'danger', value: '#d93025' },
    { key: 'warning', value: '#b45309' },
    { key: 'success', value: '#12853d' },
])

function set(key, value) {
    setTheme({ [key]: value })
    const t = tokens.value.find((t) => t.key === key)
    if (t) {
        t.value = value
    }
}

function reset() {
    for (const t of ['accent', 'danger', 'warning', 'success']) {
        document.documentElement.style.removeProperty(`--s-${t}`)
    }
}

const toc = [
    { id: 'tokens', label: 'Token reference' },
    { id: 'css', label: 'CSS override' },
    { id: 'runtime', label: 'Runtime API' },
    { id: 'scoped', label: 'Scoped themes' },
    { id: 'dark', label: 'Dark mode' },
    { id: 'foundations', label: 'Design foundations' },
]

const tokenRows = [
    { token: '--s-accent', role: 'Primary actions, links, active states' },
    { token: '--s-accent-hover', role: 'Primary hover fill' },
    { token: '--s-accent-text', role: 'Accent as foreground (focus rings, links)' },
    { token: '--s-danger', role: 'Destructive actions and errors' },
    { token: '--s-warning', role: 'Warnings and pending states' },
    { token: '--s-success', role: 'Success and confirmed states' },
    { token: '--s-bg', role: 'Page background' },
    { token: '--s-surface', role: 'Cards and panels' },
    { token: '--s-surface-raised', role: 'Elevated elements, hovers, inputs' },
    { token: '--s-text-primary', role: 'Headings and labels' },
    { token: '--s-text-secondary', role: 'Supporting text' },
    { token: '--s-text-muted', role: 'Hints, timestamps, empty states' },
    { token: '--s-border', role: 'Card outlines and dividers' },
    { token: '--s-border-input', role: 'Text field boundaries' },
    { token: '--s-border-strong', role: 'Small control boundaries (switch, checkbox)' },
]
</script>

<style>
.s-radius-spec {
    width: 3rem;
    height: 3rem;
    background-color: var(--s-surface-raised);
    border: 1px solid var(--s-border);
    display: inline-block;
}
.s-elev-spec {
    width: 4.5rem;
    height: 3rem;
    background-color: var(--s-surface);
    border: 1px solid var(--s-border);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    color: var(--s-text-secondary);
}
</style>
