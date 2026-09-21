<template>
    <s-date-range-picker v-model="stay" label="Stay dates" />
    <p class="text-sm s-text-muted mt-2">From {{ stay[0] || '—' }} to {{ stay[1] || '—' }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SDateRangePicker } from '@kundancool/simple-ui'

const stay = ref([])
</script>
