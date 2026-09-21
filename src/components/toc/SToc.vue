<template>
    <nav class="s-toc text-sm" aria-label="On this page">
        <p v-if="title" class="px-2 mb-1 text-[11px] font-semibold uppercase tracking-wider s-text-muted">{{ title }}</p>
        <button
            v-for="item in items"
            :key="item.id"
            type="button"
            class="s-toc-link flex w-full text-left px-2 py-1 rounded-md transition-colors"
            :class="[
                item.depth > 1 ? 'pl-5' : '',
                active === item.id ? 's-bg-accent-subtle s-text-accent font-medium' : 's-text-secondary',
            ]"
            :aria-current="active === item.id ? 'location' : undefined"
            @click="jump(item.id)"
        >
            <span class="truncate">{{ item.label }}</span>
        </button>
    </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

defineOptions({ name: 'SToc' })

const props = defineProps({
    /** [{ id, label, depth? }] — ids must exist in the page. */
    items: { type: Array, required: true },
    title: { type: String, default: 'On this page' },
    /** Highlight the section in view. */
    spy: { type: Boolean, default: true },
    /** scrollIntoView behavior. */
    behavior: { type: String, default: 'smooth', validator: (v) => ['smooth', 'auto'].includes(v) },
})

const emit = defineEmits(['select'])

const active = ref(props.items[0]?.id ?? null)
let observer = null

function jump(id) {
    active.value = id
    document.getElementById(id)?.scrollIntoView({ behavior: props.behavior, block: 'start' })
    emit('select', id)
}

function observe() {
    disconnect()
    if (!props.spy || typeof IntersectionObserver === 'undefined') {
        return
    }
    const visible = new Map()
    observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    visible.set(entry.target.id, entry.boundingClientRect.top)
                } else {
                    visible.delete(entry.target.id)
                }
            }
            if (visible.size) {
                active.value = [...visible.entries()].sort((a, b) => a[1] - b[1])[0][0]
            }
        },
        { rootMargin: '-20% 0px -70% 0px' },
    )
    for (const item of props.items) {
        const el = document.getElementById(item.id)
        if (el) {
            observer.observe(el)
        }
    }
}

function disconnect() {
    observer?.disconnect()
    observer = null
}

watch(() => props.items, observe, { deep: true })
onMounted(observe)
onBeforeUnmount(disconnect)

defineExpose({ jump })
</script>

<style>
.s-toc-link:hover {
    background-color: var(--s-surface-raised);
    color: var(--s-text-primary);
}
.s-toc-link.s-bg-accent-subtle:hover {
    background-color: var(--s-accent-subtle);
    color: var(--s-accent-text-hover);
}
</style>
