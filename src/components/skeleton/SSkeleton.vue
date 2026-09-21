<template>
    <div
        v-if="lines > 1"
        class="space-y-2"
        role="status"
        :aria-label="ariaLabel"
        aria-live="polite"
        aria-busy="true"
    >
        <div
            v-for="line in lines"
            :key="line"
            class="s-skeleton"
            :class="[shapeClass, heightClass]"
            :style="line === lines && lines > 1 ? { width: lastLineWidth } : widthStyle"
        />
    </div>
    <div
        v-else
        class="s-skeleton"
        :class="[shapeClass, heightClass]"
        :style="widthStyle"
        role="status"
        :aria-label="ariaLabel"
        aria-live="polite"
        aria-busy="true"
    />
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'SSkeleton' })

const props = defineProps({
    /** Stacked bars; the last is shortened like a text line ending. */
    lines: { type: Number, default: 1 },
    shape: { type: String, default: 'rect', validator: (v) => ['rect', 'circle', 'text'].includes(v) },
    /** Height step (4, 12…). Ignored for circles. */
    height: { type: [String, Number], default: '4' },
    /** Size step for circles — sets width and height. */
    size: { type: [String, Number], default: '10' },
    width: { type: String, default: '100%' },
    lastLineWidth: { type: String, default: '60%' },
    rounded: { type: String, default: 'md' },
    ariaLabel: { type: String, default: 'Loading' },
})

const HEIGHTS = {
    '2': 'h-2', '3': 'h-3', '4': 'h-4', '5': 'h-5', '6': 'h-6', '8': 'h-8',
    '10': 'h-10', '12': 'h-12', '16': 'h-16', '20': 'h-20', '24': 'h-24', '32': 'h-32',
    '40': 'h-40', '48': 'h-48', '56': 'h-56', '64': 'h-64', '72': 'h-72', '80': 'h-80',
}
const SIZES = {
    '6': 'w-6 h-6', '8': 'w-8 h-8', '10': 'w-10 h-10', '12': 'w-12 h-12', '16': 'w-16 h-16',
}
const ROUNDED = { none: '', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', full: 'rounded-full' }

const shapeClass = computed(() =>
    props.shape === 'circle'
        ? `${SIZES[String(props.size)] ?? 'w-10 h-10'} rounded-full`
        : ROUNDED[props.rounded] ?? 'rounded-md',
)
const heightClass = computed(() => (props.shape === 'circle' ? '' : (HEIGHTS[String(props.height)] ?? 'h-4')))
const widthStyle = computed(() => (props.shape === 'circle' ? {} : { width: props.width }))
</script>
