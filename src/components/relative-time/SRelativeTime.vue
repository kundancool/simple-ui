<template>
    <button
        type="button"
        class="text-xs s-text-secondary tabular-nums whitespace-nowrap transition-colors cursor-pointer s-relative-time"
        @click="toggled = !toggled"
        :title="absolute"
    >
        {{ toggled ? absolute : relative }}
    </button>
</template>

<script setup>
import { ref, computed } from 'vue'

defineOptions({ name: 'SRelativeTime' })

const props = defineProps({
    value: { type: [String, Number, Date], default: null },
})

const toggled = ref(false)

const absolute = computed(() => {
    if (!props.value) {
        return '—'
    }
    const d = new Date(props.value)
    if (Number.isNaN(d.getTime())) {
        return String(props.value)
    }
    return d.toLocaleString()
})

const relative = computed(() => {
    if (!props.value) {
        return '—'
    }
    const d = new Date(props.value)
    if (Number.isNaN(d.getTime())) {
        return String(props.value)
    }
    const diff = Date.now() - d.getTime()
    if (diff < 0) {
        return d.toLocaleString()
    }
    const seconds = Math.floor(diff / 1000)
    if (seconds < 60) {
        return `${seconds} Sec ago`
    }
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) {
        return `${minutes} Min ago`
    }
    const hours = Math.floor(minutes / 60)
    if (hours < 24) {
        return `${hours} Hour${hours > 1 ? 's' : ''} ago`
    }
    const days = Math.floor(hours / 24)
    if (days < 30) {
        return `${days} Day${days > 1 ? 's' : ''} ago`
    }
    const months = Math.floor(days / 30)
    if (months < 12) {
        return `${months} Month${months > 1 ? 's' : ''} ago`
    }
    const years = Math.floor(months / 12)
    return `${years} Year${years > 1 ? 's' : ''} ago`
})
</script>

<style>
.s-relative-time:hover {
    color: var(--s-text-primary);
}
</style>
