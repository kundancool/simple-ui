<template>
    <div class="flex flex-wrap gap-2">
        <s-button size="sm" variant="secondary" @click="show = true">Delete order</s-button>
    </div>
    <s-confirm-dialog v-model="show" title="Delete order" message="ORD-002 and its payments will be removed. This cannot be undone." confirm-text="Delete" @confirm="done" />
    <p v-if="message" class="text-sm s-text-success mt-2">{{ message }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SButton } from '@kundancool/simple-ui'
import { SConfirmDialog } from '@kundancool/simple-ui'

const show = ref(false)
const message = ref('')

function done() {
    show.value = false
    message.value = 'Order deleted.'
}
</script>
