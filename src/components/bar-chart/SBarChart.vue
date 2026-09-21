<template>
    <div v-if="!labels || labels.length === 0" class="flex items-center justify-center text-xs s-text-muted" :style="{ height: height + 'px' }">
        <slot name="empty">No data</slot>
    </div>
    <div v-else class="relative w-full" :style="{ height: height + 'px' }">
        <component :is="Runtime" v-if="Runtime" :data="chartData" :options="mergedOptions" />
        <div v-else class="s-skeleton h-full w-full rounded-md" aria-hidden="true" />
    </div>
</template>

<script setup>
import { computed, onMounted, shallowRef } from 'vue'

defineOptions({ name: 'SBarChart' })

const props = defineProps({
    labels: { type: Array, default: () => [] },
    datasets: { type: Array, default: () => [] },
    options: { type: Object, default: () => ({}) },
    height: { type: Number, default: 260 },
})

/** Resolved lazily so chart.js never loads unless a chart is on screen. */
const Runtime = shallowRef(null)

onMounted(async () => {
    Runtime.value = (await import('../../charts/runtime')).Bar
})

const chartData = computed(() => ({ labels: props.labels, datasets: props.datasets }))

const mergedOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: true, position: 'bottom', labels: { boxWidth: 10, usePointStyle: true } },
        tooltip: { padding: 8, cornerRadius: 6 },
    },
    scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, grid: { color: 'rgba(148, 163, 184, 0.15)' } },
    },
    ...props.options,
}))
</script>
