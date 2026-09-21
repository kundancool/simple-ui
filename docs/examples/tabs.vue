<template>
    <s-tabs v-model="tab" :tabs="tabs" />
    <p class="text-sm s-text-secondary mt-2">Active: {{ tab }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { STabs } from '@kundancool/simple-ui'

const tab = ref('overview')
const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'orders', label: 'Orders', count: 12 },
    { key: 'reports', label: 'Reports' },
]
</script>
