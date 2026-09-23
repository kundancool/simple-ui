<template>
    <SIcon v-if="typeof icon === 'string'" :name="icon" :size="size" :spinning="spinning" v-bind="$attrs" />
    <component :is="icon" v-else-if="icon" :class="sizeClass" v-bind="$attrs" />
</template>

<script setup>
import { computed } from 'vue'
import SIcon from '../components/icon/SIcon.vue'
import { isFieldSize } from '../utils/fieldSize'

/**
 * Internal helper: components that accept "a component or a registry name"
 * render through this so both forms behave identically.
 */
defineOptions({ name: 'IconRender', inheritAttrs: false })

const props = defineProps({
    icon: { type: [String, Object, Function], default: null },
    size: { type: String, default: 'md', validator: isFieldSize },
    spinning: { type: Boolean, default: false },
})

/** Mirrors SIcon glyph sizes so string and component icons match exactly. */
const sizeClass = computed(() => {
    const map = {
        xs: 'w-3.5 h-3.5',
        sm: 'w-4 h-4',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
        xl: 'w-6 h-6',
        '2xl': 'w-8 h-8',
        '3xl': 'w-10 h-10',
    }
    return map[props.size] ?? 'w-4 h-4'
})
</script>
