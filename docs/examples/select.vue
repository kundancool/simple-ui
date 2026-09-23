<template>
    <s-select v-model="channel" label="Channel" filterable clearable>
        <s-option label="Direct" value="direct" />
        <s-option label="Marketplace" value="marketplace" />
        <s-option label="Reseller" value="reseller" />
        <s-option label="Withdrawn channel" value="none" disabled />
    </s-select>
    <s-select v-model="status" label="From data" :options="options" option-label="label" option-value="value" class="mt-4" />
    <p class="text-sm s-text-muted mt-2">Channel: {{ channel || '—' }} · Status: {{ status || '—' }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SSelect } from '@kundancool/simple-ui'
import { SOption } from '@kundancool/simple-ui'

const channel = ref('direct')
const status = ref('')
const options = [
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'pending', label: 'Pending' },
]
</script>
