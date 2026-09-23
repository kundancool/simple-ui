<!-- demo: One, two and three columns — Same items, three layouts. -->
<template>
    <div class="space-y-4">
        <s-descriptions :items="items" :columns="1" />
        <s-descriptions :items="items" :columns="2" />
        <s-descriptions :items="items" :columns="3" />
    </div>
</template>

<script setup>
import { SDescriptions } from '@kundancool/simple-ui'

const items = [
    { label: 'Billed to', value: 'Aarav Sharma' },
    { label: 'Due', value: '26 Sep 2026' },
    { label: 'Total', value: '₹14,278' },
]
</script>
