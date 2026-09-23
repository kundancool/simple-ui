<!-- demo: Disabled dates — Weekends via disabledDate plus a blocked range via disabledRanges. -->
<template>
    <s-date-picker
        v-model="day"
        label="Delivery date"
        :disabled-date="isWeekend"
        :disabled-ranges="[['2026-09-10', '2026-09-12']]"
    />
    <p class="mt-2 text-sm s-text-secondary">Day: {{ day || '—' }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SDatePicker } from '@kundancool/simple-ui'

const day = ref('')

function isWeekend(date) {
    return date.getDay() === 0 || date.getDay() === 6
}
</script>
