<template>
    <s-breadcrumb :items="trail" @navigate="current = $event.label" />
    <p class="text-sm s-text-muted mt-2">Current: {{ current }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SBreadcrumb } from '@kundancool/simple-ui'

const current = ref('Revenue')
const trail = ref([
    { label: 'Reports', to: '#/docs/dashboard' },
    { label: 'Revenue' },
])
</script>
