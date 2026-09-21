<template>
    <s-date-range-picker v-model="period" label="Date range" />
    <p class="text-sm s-text-muted mt-2">From {{ period[0] || '—' }} to {{ period[1] || '—' }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SDateRangePicker } from '@kundancool/simple-ui'

const period = ref([])
</script>
