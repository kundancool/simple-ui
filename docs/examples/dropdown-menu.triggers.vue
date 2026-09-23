<!-- demo: Default and custom triggers — The labeled button vs your own trigger slot. -->
<template>
    <div class="flex flex-wrap items-center gap-2">
        <s-dropdown-menu :items="items" @select="picked = $event.label" />
        <s-dropdown-menu :items="items" @select="picked = $event.label">
            <template #trigger>
                <s-button size="sm" variant="ghost">Custom trigger</s-button>
            </template>
        </s-dropdown-menu>
        <span class="text-sm s-text-muted">Picked: {{ picked || '—' }}</span>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { SDropdownMenu } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'

const picked = ref('')
const items = [
    { key: 'edit', label: 'Edit order' },
    { key: 'invoice', label: 'Download invoice' },
    { type: 'separator' },
    { key: 'cancel', label: 'Cancel order', danger: true },
]
</script>
