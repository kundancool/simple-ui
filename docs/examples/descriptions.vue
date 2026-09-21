<template>
    <s-descriptions :items="items" />
</template>

<script setup>
import { SDescriptions } from '@kundancool/simple-ui'

const items = [
    { label: 'Billed to', value: 'Aarav Sharma' },
    { label: 'Due', value: '26 Sep 2026' },
    { label: 'Invoice', value: 'INV-2026-0841' },
    { label: 'Status', value: 'Unpaid' },
]
</script>
