<!-- demo: Range mode — Plain range and range with shortcut options, side by side. -->
<template>
    <s-date-picker v-model="period" range label="Date range" />
    <s-date-picker v-model="week" range label="With shortcuts" :options="shortcuts" class="mt-4" />
    <p class="mt-2 text-sm s-text-secondary">Range: {{ (period || []).join(' → ') || '—' }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SDatePicker } from '@kundancool/simple-ui'

const period = ref([])
const week = ref([])
const shortcuts = [
    { label: 'Yesterday', range: ['2026-09-21', '2026-09-21'] },
    { label: 'Last 7 days', range: ['2026-09-15', '2026-09-21'] },
]
</script>
