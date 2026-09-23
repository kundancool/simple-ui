<!-- demo: Filterable, error, disabled, loading — Every select state. -->
<template>
    <div class="space-y-4 max-w-sm">
        <s-select v-model="a" label="Filterable" filterable :options="options" option-label="label" option-value="value" />
        <s-select v-model="b" label="With error" error="Pick one." :options="options" option-label="label" option-value="value" />
        <s-select v-model="c" label="Disabled" disabled :options="options" option-label="label" option-value="value" />
        <s-select v-model="d" label="Loading" loading :options="options" option-label="label" option-value="value" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { SSelect } from '@kundancool/simple-ui'

const a = ref('')
const b = ref('')
const c = ref('')
const d = ref('')
const options = [
    { value: 'a', label: 'Alpha' },
    { value: 'b', label: 'Beta' },
]
</script>
