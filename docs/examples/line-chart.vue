<template>
    <s-line-chart :labels="labels" :datasets="datasets" :height="220" />
</template>

<script setup>
import { SLineChart } from '@kundancool/simple-ui'

const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const datasets = [
    { label: 'Revenue', data: [12, 19, 8, 15, 22, 30, 26], borderColor: '#0c7076', backgroundColor: 'rgba(12,112,118,0.12)', fill: true, tension: 0.4 },
]
</script>
