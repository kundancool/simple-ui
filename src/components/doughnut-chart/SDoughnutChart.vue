<template>
    <div v-if="!labels || labels.length === 0" class="flex items-center justify-center text-xs s-text-muted" :style="{ height: height + 'px' }">
        <slot name="empty">No data</slot>
    </div>
    <div v-else class="relative w-full" :style="{ height: height + 'px' }">
        <Doughnut :data="chartData" :options="mergedOptions" />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

defineOptions({ name: 'SDoughnutChart' })

ChartJS.register(ArcElement, Tooltip, Legend)

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
    cutout: '62%',
    plugins: {
        legend: { display: true, position: 'bottom', labels: { boxWidth: 10, usePointStyle: true } },
        tooltip: { padding: 8, cornerRadius: 6 },
    },
    ...props.options,
}))
</script>
