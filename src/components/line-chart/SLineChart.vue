<template>
    <div v-if="!labels || labels.length === 0" class="flex items-center justify-center text-xs s-text-muted" :style="{ height: height + 'px' }">
        <slot name="empty">No data</slot>
    </div>
    <div v-else class="relative w-full" :style="{ height: height + 'px' }">
        <Line :data="chartData" :options="mergedOptions" />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js'
import { Line } from 'vue-chartjs'

defineOptions({ name: 'SLineChart' })

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const props = defineProps({
    labels: { type: Array, default: () => [] },
    datasets: { type: Array, default: () => [] },
    options: { type: Object, default: () => ({}) },
    height: { type: Number, default: 260 },
})

const chartData = computed(() => ({ labels: props.labels, datasets: props.datasets }))

const mergedOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
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
