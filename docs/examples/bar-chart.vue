<template>
    <s-bar-chart :labels="labels" :datasets="datasets" :height="220" />
</template>

<script setup>
import { SBarChart } from '@kundancool/simple-ui'

const labels = ['Direct', 'Marketplace', 'Partner', 'Reseller']
const datasets = [{ label: 'Orders', data: [42, 68, 55, 21], backgroundColor: '#0c7076', borderRadius: 4 }]
</script>
