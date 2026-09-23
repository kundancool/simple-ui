<template>
    <s-dropdown-menu :items="items" @select="picked = $event.label" />
    <p class="text-sm s-text-muted mt-2">Picked: {{ picked || '—' }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SDropdownMenu } from '@kundancool/simple-ui'

const picked = ref('')
const items = [
    { key: 'edit', label: 'Edit order' },
    { key: 'invoice', label: 'Download invoice' },
    { type: 'separator' },
    { key: 'cancel', label: 'Cancel order', danger: true },
]
</script>
