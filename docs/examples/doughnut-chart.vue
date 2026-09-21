<template>
    <s-doughnut-chart :labels="labels" :datasets="datasets" :height="220" />
</template>

<script setup>
import { SDoughnutChart } from '@kundancool/simple-ui'

const labels = ['Paid', 'Outstanding']
const datasets = [{ data: [38210, 10000], backgroundColor: ['#12853d', '#b45309'], borderWidth: 0 }]
</script>
