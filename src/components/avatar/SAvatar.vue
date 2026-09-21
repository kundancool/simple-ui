<template>
    <span
        class="inline-flex items-center justify-center rounded-full font-bold flex-shrink-0 overflow-hidden"
        :class="[sizeClass, toneClass]"
        :title="name || undefined"
        role="img"
        :aria-label="name || 'Avatar'"
    >
        <img v-if="src" :src="src" :alt="name || 'Avatar'" class="w-full h-full object-cover" />
        <component :is="icon" v-else-if="icon" :class="iconClass" />
        <span v-else aria-hidden="true">{{ initials }}</span>
    </span>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'SAvatar' })

const props = defineProps({
    /** Full name — initials are derived automatically. */
    name: { type: String, default: '' },
    /** Image URL. Falls back to initials when absent. */
    src: { type: String, default: '' },
    /** Icon component override. */
    icon: { type: [Object, Function], default: null },
    size: { type: String, default: 'md', validator: (v) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(v) },
    /** Tint pair key. */
    tone: { type: String, default: 'blue', validator: (v) => ['blue', 'green', 'yellow', 'purple', 'orange'].includes(v) },
})

const initials = computed(() => {
    const parts = props.name.trim().split(/\s+/)
    if (!parts[0]) {
        return '?'
    }
    return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase()
})

const sizeClass = computed(() => {
    const map = {
        xs: 'w-6 h-6 text-[10px]',
        sm: 'w-8 h-8 text-[11px]',
        md: 'w-9 h-9 text-xs',
        lg: 'w-12 h-12 text-sm',
        xl: 'w-16 h-16 text-lg',
    }
    return map[props.size]
})

const toneClass = computed(() => {
    const map = {
        blue: 's-bg-icon-blue s-text-icon-blue',
        green: 's-bg-icon-green s-text-icon-green',
        yellow: 's-bg-icon-yellow s-text-icon-yellow',
        purple: 's-bg-icon-purple s-text-icon-purple',
        orange: 's-bg-icon-orange s-text-icon-orange',
    }
    return map[props.tone]
})

const iconClass = computed(() => {
    const map = { xs: 'w-3 h-3', sm: 'w-4 h-4', md: 'w-4 h-4', lg: 'w-5 h-5', xl: 'w-7 h-7' }
    return map[props.size]
})
</script>
