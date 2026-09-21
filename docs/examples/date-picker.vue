<template>
    <s-date-picker v-model="day" label="Check-in" />
    <s-date-picker v-model="stay" label="Stay dates" range />
    <p class="text-sm s-text-secondary">Day: {{ day || '—' }} · Stay: {{ (stay || []).join(' → ') || '—' }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SDatePicker } from '@kundancool/simple-ui'

const day = ref('')
const stay = ref([])
</script>
