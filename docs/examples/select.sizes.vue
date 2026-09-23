<!-- demo: Every size — xs to lg selects. -->
<template>
    <div class="space-y-4 max-w-sm">
        <s-select v-model="v" label="Extra small" size="xs" :options="options" option-label="label" option-value="value" />
        <s-select v-model="v" label="Small" size="sm" :options="options" option-label="label" option-value="value" />
        <s-select v-model="v" label="Medium" :options="options" option-label="label" option-value="value" />
        <s-select v-model="v" label="Large" size="lg" :options="options" option-label="label" option-value="value" />
        <s-select v-model="v" label="Extra large" size="xl" :options="options" option-label="label" option-value="value" />
        <s-select v-model="v" label="Huge" size="2xl" :options="options" option-label="label" option-value="value" />
        <s-select v-model="v" label="Giant" size="3xl" :options="options" option-label="label" option-value="value" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { SSelect } from '@kundancool/simple-ui'

const v = ref('')
const options = [
    { value: 'a', label: 'Alpha' },
    { value: 'b', label: 'Beta' },
]
</script>
