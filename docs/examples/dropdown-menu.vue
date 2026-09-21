<template>
    <div class="flex flex-wrap items-center gap-2">
        <s-dropdown-menu :items="items" @select="picked = $event.label" />
        <s-dropdown-menu label="Row actions" trigger="icon-square" :items="items" @select="picked = $event.label" />
        <span class="text-sm s-text-muted">Picked: {{ picked || '—' }}</span>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { SDropdownMenu } from '@kundancool/simple-ui'

const picked = ref('')
const items = [
    { key: 'edit', label: 'Edit booking' },
    { key: 'invoice', label: 'Download invoice' },
    { type: 'separator' },
    { key: 'cancel', label: 'Cancel booking', danger: true },
]
</script>
