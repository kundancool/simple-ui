<template>
    <s-search-palette v-model="open" :items="items" placeholder="Search pages and components…" @select="go" />
</template>

<script setup>
import { ref, computed } from 'vue'
import { LayoutGrid, Palette, Bot } from 'lucide-vue-next'
import { SSearchPalette } from '@kundancool/simple-ui'

const props = defineProps({
    registry: { type: Object, default: () => ({ components: [] }) },
})

const open = ref(false)

const items = computed(() => [
    { label: 'Getting started', hint: 'Guide', to: '#/docs', icon: LayoutGrid, keywords: 'home install start' },
    { label: 'Theming & design', hint: 'Guide', to: '#/docs/theming', icon: Palette, keywords: 'dark theme colors' },
    { label: 'Build with AI', hint: 'Guide', to: '#/docs/ai', icon: Bot, keywords: 'mcp llms' },
    ...(props.registry.components ?? []).map((c) => ({
        label: c.name,
        hint: `${c.category} · <${c.tag}>`,
        to: `#/docs/components/${c.dir}`,
        keywords: `${c.tag} ${c.category} ${c.description}`,
    })),
])

function go(item) {
    if (item.to) {
        window.location.hash = item.to
    }
}

defineExpose({ open })
</script>
