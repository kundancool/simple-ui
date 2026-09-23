<!-- demo: Fullscreen takeover — Fills the viewport for immersive flows like editors and wizards. -->
<template>
    <s-button @click="open = true">Open fullscreen dialog</s-button>
    <s-dialog v-model="open" title="Order ORD-102" fullscreen>
        <p class="text-sm s-text-secondary">Fullscreen dialogs keep the title bar and footer pinned while the body scrolls — useful for editors, previews and multi-step flows.</p>
        <div class="grid sm:grid-cols-2 gap-3 mt-3">
            <s-card title="Customer"><p class="text-sm s-text-secondary">Aarav Sharma · aarav@example.test</p></s-card>
            <s-card title="Total"><p class="text-sm s-text-secondary">₹14,278 due 26 Sep 2026</p></s-card>
        </div>
        <template #footer>
            <s-button variant="secondary" @click="open = false">Close</s-button>
            <s-button @click="open = false">Confirm order</s-button>
        </template>
    </s-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { SButton } from '@kundancool/simple-ui'
import { SDialog } from '@kundancool/simple-ui'
import { SCard } from '@kundancool/simple-ui'

const open = ref(false)
</script>
