<template>
    <s-multi-select v-model="ids" label="Item types" :options="options" />
    <p class="text-sm s-text-muted">Selected: {{ ids.join(', ') || '—' }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SMultiSelect } from '@kundancool/simple-ui'

const ids = ref([1])
const options = [
    { id: 1, name: 'Basic' },
    { id: 2, name: 'Standard' },
    { id: 3, name: 'Premium' },
    { id: 4, name: 'Enterprise' },
]
</script>
