<template>
    <s-button @click="open = true">Open dialog</s-button>
    <s-dialog v-model="open" title="Confirm action" width="sm">
        <p class="text-sm s-text-secondary">Check out Aarav Sharma from Item 204?</p>
        <template #footer>
            <s-button variant="secondary" @click="open = false">Cancel</s-button>
            <s-button @click="open = false">Check out</s-button>
        </template>
    </s-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { SButton } from '@kundancool/simple-ui'
import { SDialog } from '@kundancool/simple-ui'

const open = ref(false)
</script>
