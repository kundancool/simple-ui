<template>
    <s-date-range-picker v-model="period" label="Date range" :presets="shortcuts" />
    <p class="text-sm s-text-muted mt-2">From {{ period[0] || '—' }} to {{ period[1] || '—' }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SDateRangePicker } from '@kundancool/simple-ui'

const period = ref([])
const shortcuts = [
    { label: 'Yesterday', range: ['2026-09-21', '2026-09-21'] },
    { label: 'Last 7 days', range: ['2026-09-15', '2026-09-21'] },
    { label: 'This month', range: ['2026-09-01', '2026-09-21'] },
]
</script>
