<template>
    <s-date-picker v-model="day" label="Start date" />
    <s-date-picker v-model="period" label="Date range" range />
    <p class="text-sm s-text-secondary">Day: {{ day || '—' }} · Range: {{ (period || []).join(' → ') || '—' }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SDatePicker } from '@kundancool/simple-ui'

const day = ref('')
const period = ref([])
</script>
