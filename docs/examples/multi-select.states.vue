<!-- demo: No search, error, disabled, loading — Every multi-select state. -->
<template>
    <div class="space-y-4 max-w-sm">
        <s-multi-select v-model="ids" label="No search box" :searchable="false" :options="options" />
        <s-multi-select v-model="err" label="With error" error="Pick at least one." :options="options" />
        <s-multi-select v-model="off" label="Disabled" disabled :options="options" />
        <s-multi-select v-model="ids" label="Loading" loading :options="options" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { SMultiSelect } from '@kundancool/simple-ui'

const ids = ref([1])
const err = ref([])
const off = ref([])
const options = [
    { id: 1, name: 'Basic' },
    { id: 2, name: 'Standard' },
    { id: 3, name: 'Premium' },
]
</script>
