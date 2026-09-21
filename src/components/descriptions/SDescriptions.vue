<template>
    <dl
        class="grid gap-x-6 gap-y-3"
        :class="columnClass"
    >
        <div v-for="(item, index) in items" :key="item.key ?? index" :class="bordered ? 'border s-border-theme rounded-lg p-3' : ''">
            <dt class="text-xs font-medium uppercase tracking-wider s-text-muted">{{ item.label }}</dt>
            <dd class="text-sm s-text-primary mt-0.5">
                <slot :name="`value-${item.key ?? index}`" :item="item">{{ item.value }}</slot>
            </dd>
        </div>
    </dl>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'SDescriptions' })

const props = defineProps({
    /** [{ key?, label, value }] */
    items: { type: Array, required: true },
    columns: { type: Number, default: 2, validator: (v) => [1, 2, 3].includes(v) },
    bordered: { type: Boolean, default: false },
})

const columnClass = computed(() => {
    const map = { 1: 'grid-cols-1', 2: 'grid-cols-1 sm:grid-cols-2', 3: 'grid-cols-1 sm:grid-cols-3' }
    return map[props.columns]
})
</script>
