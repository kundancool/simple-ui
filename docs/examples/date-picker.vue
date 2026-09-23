<template>
    <s-date-picker v-model="day" label="Start date" />
    <s-date-picker v-model="special" label="With shortcuts" :options="shortcuts" class="mt-4" />
    <p class="mt-2 text-sm s-text-secondary">Day: {{ day || '—' }} · Special: {{ special || '—' }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SDatePicker } from '@kundancool/simple-ui'

const day = ref('')
const special = ref('')
// Option format: { label, value } for single dates,
// { label, range: [from, to] } for ranges — YYYY-MM-DD.
const shortcuts = [
    { label: 'Today', value: '2026-09-23' },
    { label: 'Payday', value: '2026-09-30' },
]
</script>
