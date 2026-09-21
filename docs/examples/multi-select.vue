<template>
    <s-multi-select v-model="ids" label="Room types" :options="options" />
    <p class="text-sm s-text-muted">Selected: {{ ids.join(', ') || '—' }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SMultiSelect } from '@kundancool/simple-ui'

const ids = ref([1])
const options = [
    { id: 1, name: 'Deluxe' },
    { id: 2, name: 'Suite' },
    { id: 3, name: 'Standard' },
    { id: 4, name: 'Family' },
]
</script>
