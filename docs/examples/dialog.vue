<template>
    <s-button @click="open = true">Open dialog</s-button>
    <s-dialog v-model="open" title="Confirm action" width="sm">
        <p class="text-sm s-text-secondary">Delete order ORD-002 and its payments? This cannot be undone.</p>
        <template #footer>
            <s-button variant="secondary" @click="open = false">Cancel</s-button>
            <s-button @click="open = false">Delete</s-button>
        </template>
    </s-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { SButton } from '@kundancool/simple-ui'
import { SDialog } from '@kundancool/simple-ui'

const open = ref(false)
</script>
