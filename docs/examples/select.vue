<template>
    <s-select v-model="slotted" label="Slotted options" filterable clearable @change="onChange">
        <s-option label="Direct" value="direct" />
        <s-option label="Marketplace" value="marketplace" />
        <s-option label="Reseller" value="goibibo" />
        <s-option label="Withdrawn channel" value="none" disabled />
    </s-select>
    <s-select v-model="fromArray" label="Array options" :options="options" option-label="label" option-value="value" clearable />
    <p class="text-sm s-text-muted">Slotted: {{ slotted || '—' }} · Array: {{ fromArray || '—' }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SSelect } from '@kundancool/simple-ui'
import { SOption } from '@kundancool/simple-ui'

const slotted = ref('direct')
const fromArray = ref('')
const options = [
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'pending', label: 'Pending' },
]

function onChange(value) {
    // Hook for a refetch, toast, etc.
    void value
}
</script>
