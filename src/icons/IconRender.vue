<template>
    <SIcon v-if="typeof icon === 'string'" :name="icon" :size="size" :spinning="spinning" v-bind="$attrs" />
    <component :is="icon" v-else-if="icon" :class="sizeClass" v-bind="$attrs" />
</template>

<script setup>
import { computed } from 'vue'
import SIcon from '../components/icon/SIcon.vue'

/**
 * Internal helper: components that accept "a component or a registry name"
 * render through this so both forms behave identically.
 */
defineOptions({ name: 'IconRender', inheritAttrs: false })

const props = defineProps({
    icon: { type: [String, Object, Function], default: null },
    size: { type: String, default: 'md' },
    spinning: { type: Boolean, default: false },
})

const sizeClass = computed(() => {
    const map = {
        xs: 'w-3 h-3',
        sm: 'w-3.5 h-3.5',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
    }
    return map[props.size] ?? 'w-4 h-4'
})
</script>
