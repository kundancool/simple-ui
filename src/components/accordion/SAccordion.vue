<template>
    <div class="border s-border-theme rounded-xl overflow-hidden">
        <div v-for="(item, index) in items" :key="item.key ?? index" class="border-b s-border-theme last:border-0">
            <button
                type="button"
                class="w-full flex items-center gap-2 px-4 py-3 text-left text-sm font-medium transition-colors"
                :class="isOpen(item, index) ? 's-text-primary' : 's-text-secondary s-accordion-head'"
                :aria-expanded="isOpen(item, index)"
                :aria-controls="`${accordionId}-${index}`"
                :disabled="item.disabled"
                @click="toggle(item, index)"
            >
                <span class="flex-1">{{ item.title }}</span>
                <svg class="w-4 h-4 s-text-muted transition-transform duration-200 flex-shrink-0" :class="isOpen(item, index) ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div
                class="grid transition-[grid-template-rows] duration-200 ease-out"
                :style="{ gridTemplateRows: isOpen(item, index) ? '1fr' : '0fr' }"
            >
                <div :id="`${accordionId}-${index}`" role="region" class="overflow-hidden">
                    <div class="px-4 pb-4 text-sm s-text-secondary">
                        <slot :name="`body-${item.key ?? index}`" :item="item">{{ item.text }}</slot>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, useId } from 'vue'

defineOptions({ name: 'SAccordion' })

const props = defineProps({
    /** [{ key?, title, text?, disabled? }] — rich bodies via #body-{key} slots. */
    items: { type: Array, required: true },
    /** Open key (single) or keys (multiple). */
    modelValue: { type: [String, Number, Array], default: null },
    /** First item starts open. */
    defaultOpen: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const accordionId = useId()

function keyOf(item, index) {
    return item.key ?? index
}

/** Uncontrolled position — used while no v-model value is provided. */
const inner = ref(undefined)

function current() {
    if (props.modelValue !== null && props.modelValue !== undefined) {
        return props.multiple ? (Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]) : [props.modelValue]
    }
    if (inner.value !== undefined) {
        return props.multiple ? inner.value : [inner.value]
    }
    if (props.defaultOpen && props.items.length) {
        return [keyOf(props.items[0], 0)]
    }
    return []
}

function isOpen(item, index) {
    return current().includes(keyOf(item, index))
}

function toggle(item, index) {
    if (item.disabled) {
        return
    }
    const key = keyOf(item, index)
    if (props.multiple) {
        const next = current().includes(key) ? current().filter((k) => k !== key) : [...current(), key]
        if (props.modelValue === null || props.modelValue === undefined) {
            inner.value = next
        }
        emit('update:modelValue', next)
        return
    }
    const next = isOpen(item, index) ? null : key
    if (props.modelValue === null || props.modelValue === undefined) {
        inner.value = next
    }
    emit('update:modelValue', next)
}
</script>

<style>
.s-accordion-head:hover {
    background-color: var(--s-surface-raised);
    color: var(--s-text-primary);
}
</style>
