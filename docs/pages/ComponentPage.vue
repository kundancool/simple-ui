<template>
    <div>
        <div v-if="!component">
            <h1 class="text-2xl font-bold s-text-primary">Not found</h1>
            <p class="text-sm s-text-secondary mt-2">No component matches this page.</p>
        </div>
        <div v-else :key="component.name">
            <div class="flex items-center gap-2 flex-wrap">
                <h1 class="text-2xl font-bold s-text-primary">{{ component.name }}</h1>
                <code class="px-2 py-0.5 rounded-md text-[12px] font-mono s-bg-surface-raised s-text-accent">&lt;{{ component.tag }}&gt;</code>
                <span class="px-2 py-0.5 rounded-full text-[11px] font-medium s-bg-accent-subtle s-text-accent">{{ component.category || 'Component' }}</span>
            </div>
            <p class="text-sm s-text-secondary mt-2 max-w-2xl">{{ component.description }}</p>

            <h2 class="text-lg font-semibold s-text-primary mt-10 mb-3">Demo</h2>
            <DemoCard v-if="ExampleComp" :code="exampleCode" :title="`${component.dir}.vue`">
                <component :is="ExampleComp" />
            </DemoCard>
            <DemoBlock v-else :code="component.example" :title="component.name" />

            <template v-if="variationFiles.length">
                <h2 class="text-lg font-semibold s-text-primary mt-10 mb-3">Variations</h2>
                <div class="space-y-6">
                    <section v-for="v in variationFiles" :key="v.key">
                        <h3 class="text-[15px] font-semibold s-text-primary">{{ v.title }}</h3>
                        <p v-if="v.description" class="text-sm s-text-secondary mt-0.5 mb-2">{{ v.description }}</p>
                        <DemoCard :code="v.code" :title="`${component.dir}.${v.slug}.vue`">
                            <component :is="v.comp" />
                        </DemoCard>
                    </section>
                </div>
            </template>

            <template v-if="component.props?.length">
                <h2 class="text-lg font-semibold s-text-primary mt-10 mb-3">Props</h2>
                <s-data-table :data="component.props" :stripe="false" size="small" border>
                    <s-data-table-column prop="name" label="Name" width="150px">
                        <template #default="{ row }"><code class="font-mono text-[12px] s-text-accent">{{ row.name }}</code></template>
                    </s-data-table-column>
                    <s-data-table-column prop="type" label="Type" width="200px">
                        <template #default="{ row }"><code class="font-mono text-[12px] s-text-secondary">{{ row.type }}</code></template>
                    </s-data-table-column>
                    <s-data-table-column prop="default" label="Default" width="110px">
                        <template #default="{ row }"><code class="font-mono text-[12px] s-text-muted">{{ row.default }}</code></template>
                    </s-data-table-column>
                    <s-data-table-column prop="description" label="Description" />
                </s-data-table>
            </template>

            <template v-if="component.events?.length">
                <h2 class="text-lg font-semibold s-text-primary mt-10 mb-3">Events</h2>
                <s-data-table :data="component.events" :stripe="false" size="small" border>
                    <s-data-table-column prop="name" label="Name" width="200px">
                        <template #default="{ row }"><code class="font-mono text-[12px] s-text-accent">{{ row.name }}</code></template>
                    </s-data-table-column>
                    <s-data-table-column prop="description" label="Description" />
                </s-data-table>
            </template>

            <template v-if="component.slots?.length">
                <h2 class="text-lg font-semibold s-text-primary mt-10 mb-3">Slots</h2>
                <s-data-table :data="component.slots" :stripe="false" size="small" border>
                    <s-data-table-column prop="name" label="Name" width="180px">
                        <template #default="{ row }"><code class="font-mono text-[12px] s-text-accent">{{ row.name }}</code></template>
                    </s-data-table-column>
                    <s-data-table-column prop="params" label="Params" width="160px">
                        <template #default="{ row }"><code class="font-mono text-[12px] s-text-secondary">{{ row.params || '—' }}</code></template>
                    </s-data-table-column>
                    <s-data-table-column prop="description" label="Description" />
                </s-data-table>
            </template>

            <nav class="mt-10 pt-4 border-t s-border-theme grid grid-cols-2 gap-3">
                <a v-if="prev" :href="`#/docs/components/${prev.dir}`" class="s-docs-pager rounded-lg border s-border-theme p-3">
                    <span class="block text-[11px] uppercase tracking-wider s-text-muted">Previous</span>
                    <span class="text-sm s-text-accent">{{ prev.name }}</span>
                </a>
                <span v-else />
                <a v-if="next" :href="`#/docs/components/${next.dir}`" class="s-docs-pager rounded-lg border s-border-theme p-3 text-right">
                    <span class="block text-[11px] uppercase tracking-wider s-text-muted">Next</span>
                    <span class="text-sm s-text-accent">{{ next.name }}</span>
                </a>
            </nav>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue'
import DemoBlock from '../DemoBlock.vue'
import DemoCard from '../DemoCard.vue'
import { SDataTable } from '@kundancool/simple-ui'
import { SDataTableColumn } from '@kundancool/simple-ui'

const props = defineProps({
    registry: { type: Object, default: () => ({ components: [] }) },
    route: { type: String, default: '/' },
})

const dir = computed(() => props.route.replace('/docs/components/', ''))
const all = computed(() => props.registry.components ?? [])
const component = computed(() => all.value.find((c) => c.dir === dir.value))
const index = computed(() => all.value.findIndex((c) => c.dir === dir.value))
const prev = computed(() => (index.value > 0 ? all.value[index.value - 1] : null))
const next = computed(() => (index.value >= 0 && index.value < all.value.length - 1 ? all.value[index.value + 1] : null))

const demos = import.meta.glob('../examples/*.vue', { eager: true })
const raws = import.meta.glob('../examples/*.vue', { eager: true, query: '?raw', import: 'default' })

const ExampleComp = computed(() => demos[`../examples/${dir.value}.vue`]?.default ?? null)
const exampleCode = computed(() => raws[`../examples/${dir.value}.vue`] ?? component.value?.example ?? '')

/**
 * One section per variation. Variation files declare their own heading:
 * `<!-- demo: Title — description -->` on the first line. The page parses
 * it and never invents titles from filenames (a `<dir>.vue` main file
 * starts with `<dir>.` too, so prefix matching alone double-renders it).
 */
function parseDemoHeader(raw, fallbackTitle) {
    const match = raw.match(/<!--\s*demo:\s*([\s\S]*?)\s*-->/)
    if (!match) {
        return { title: fallbackTitle, description: '' }
    }
    const [title, ...rest] = match[1].split('—')
    return { title: (title || fallbackTitle).trim(), description: rest.join('—').trim() }
}

const humanizeSlug = (slug) =>
    slug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

const variationFiles = computed(() => {
    const mainKey = `../examples/${dir.value}.vue`
    const prefix = `../examples/${dir.value}.`
    return Object.keys(demos)
        .filter((key) => key !== mainKey && key.startsWith(prefix) && key.endsWith('.vue'))
        .sort()
        .map((key) => {
            const slug = key.slice(prefix.length, -'.vue'.length)
            const header = parseDemoHeader(raws[key] ?? '', humanizeSlug(slug))
            return { key, slug, ...header, comp: demos[key]?.default ?? null, code: raws[key] ?? '' }
        })
        .filter((v) => v.comp)
})
</script>

<style>
.s-docs-pager:hover {
    border-color: var(--s-accent-border);
    background-color: var(--s-accent-subtle);
}
</style>
