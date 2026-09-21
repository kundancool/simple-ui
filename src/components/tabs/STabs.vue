<template>
    <div class="border-b s-border-theme">
        <nav
            ref="listRef"
            role="tablist"
            :aria-label="ariaLabel || undefined"
            class="-mb-px flex gap-0.5 md:gap-1 overflow-x-auto px-1"
            style="scrollbar-width: none"
            @keydown="onKeydown"
        >
            <button
                v-for="tab in tabs"
                :key="tab.key"
                :id="`${tabsId}-tab-${tab.key}`"
                type="button"
                role="tab"
                :title="tab.label"
                :aria-selected="modelValue === tab.key"
                :tabindex="modelValue === tab.key ? 0 : -1"
                class="s-focus-ring flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
                :class="modelValue === tab.key
                    ? 's-tabs-active'
                    : 'border-transparent s-text-secondary'"
                @click="$emit('update:modelValue', tab.key)"
            >
                <component :is="tab.icon" v-if="tab.icon" class="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <span class="text-xs md:text-sm">{{ tab.label }}</span>
                <span
                    v-if="tab.count != null"
                    class="px-1.5 py-0.5 rounded-full text-xs font-medium transition-colors"
                    :class="modelValue === tab.key ? 's-bg-accent-subtle s-text-accent' : 's-bg-surface-raised s-text-muted'"
                >{{ tab.count }}</span>
            </button>
        </nav>
    </div>
</template>

<script setup>
/**
 * WAI-ARIA tablist: one tab stop for the strip, arrows move within it.
 * Selection follows focus — every tab swaps an already-loaded panel.
 */
import { ref, useId, nextTick } from 'vue'

defineOptions({ name: 'STabs' })

const props = defineProps({
    modelValue: { type: String, required: true },
    /** [{ key, label, icon?, count? }] */
    tabs: { type: Array, required: true },
    ariaLabel: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

const tabsId = useId()
const listRef = ref(null)

function activate(key) {
    emit('update:modelValue', key)
    nextTick(() => listRef.value?.querySelector(`#${CSS.escape(`${tabsId}-tab-${key}`)}`)?.focus())
}

function onKeydown(event) {
    const keys = props.tabs.map((t) => t.key)
    const at = keys.indexOf(props.modelValue)
    if (at === -1) {
        return
    }
    const moves = {
        ArrowRight: () => (at + 1) % keys.length,
        ArrowLeft: () => (at - 1 + keys.length) % keys.length,
        Home: () => 0,
        End: () => keys.length - 1,
    }
    const move = moves[event.key]
    if (!move) {
        return
    }
    event.preventDefault()
    activate(keys[move()])
}
</script>

<style>
.s-tabs-active {
    border-color: var(--s-accent-border);
    color: var(--s-accent-text);
}
button.s-tabs-active:hover {
    color: var(--s-accent-text-hover);
}
nav button:not(.s-tabs-active).border-transparent:hover {
    color: var(--s-text-primary);
    border-color: var(--s-border);
}
</style>
