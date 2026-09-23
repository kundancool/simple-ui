<!-- demo: Every size — Small to large multi-selects. -->
<template>
    <div class="space-y-4 max-w-sm">
        <s-multi-select v-model="ids" label="Small" size="sm" :options="options" />
        <s-multi-select v-model="ids" label="Medium" :options="options" />
        <s-multi-select v-model="ids" label="Large" size="lg" :options="options" />
        <s-multi-select v-model="ids" label="Extra large" size="xl" :options="options" />
        <s-multi-select v-model="ids" label="Huge" size="2xl" :options="options" />
        <s-multi-select v-model="ids" label="Giant" size="3xl" :options="options" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { SMultiSelect } from '@kundancool/simple-ui'

const ids = ref([1])
const options = [
    { id: 1, name: 'Basic' },
    { id: 2, name: 'Standard' },
    { id: 3, name: 'Premium' },
]
</script>
