<template>
    <s-filter v-model="query" placeholder="Search bookings..." @search="applied = $event">
        <s-select v-model="status" :options="statuses" option-label="label" option-value="value" class="w-40" />
    </s-filter>
    <p class="text-sm s-text-muted">Applied query: “{{ applied || '—' }}” · Status: {{ status || 'all' }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SFilter } from '@kundancool/simple-ui'
import { SSelect } from '@kundancool/simple-ui'

const query = ref('')
const applied = ref('')
const status = ref('')
const statuses = [
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'CANCELLED', label: 'Cancelled' },
]
</script>
