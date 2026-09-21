<template>
    <svg
        v-if="shapes"
        :viewBox="ICON_VIEW_BOX"
        fill="none"
        stroke="currentColor"
        :stroke-width="ICON_STROKE_WIDTH"
        stroke-linecap="round"
        stroke-linejoin="round"
        :role="label ? 'img' : undefined"
        :aria-label="label || undefined"
        :aria-hidden="label ? undefined : 'true'"
        :class="[sizeClass, spinning ? 'animate-spin' : '']"
        v-bind="$attrs"
    >
        <component :is="shape[0]" v-for="(shape, i) in shapes" :key="i" v-bind="shape[1]" />
    </svg>
</template>

<script setup>
import { computed } from 'vue'
import { ICON_VIEW_BOX, icons } from '../../icons/registry'
import { ICON_STROKE_WIDTH } from '../../icons/stroke'

defineOptions({ name: 'SIcon', inheritAttrs: false })

const props = defineProps({
    /** Registry name, case-insensitive. Unknown names render nothing. */
    name: { type: String, default: '' },
    size: { type: String, default: 'md', validator: (v) => ['xs', 'sm', 'md', 'lg'].includes(v) },
    spinning: { type: Boolean, default: false },
    /** Sets aria-label; without it the icon is aria-hidden. */
    label: { type: String, default: '' },
})

const shapes = computed(() => icons[String(props.name).toLowerCase()] ?? null)

const sizeClass = computed(() => {
    const map = {
        xs: 'size-3.5',
        sm: 'size-4',
        md: 'size-4',
        lg: 'size-5',
    }
    return map[props.size]
})
</script>
