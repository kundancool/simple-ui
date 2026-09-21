<template>
    <s-button size="sm" variant="danger" @click="show = true">Disable workspace</s-button>
    <s-confirm-by-name-dialog v-model="show" title="Disable workspace" message="New orders will be blocked immediately." expected="Acme Inc" label="workspace" confirm-text="Disable workspace" @confirm="done" />
    <p v-if="message" class="text-sm s-text-success mt-2">{{ message }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SButton } from '@kundancool/simple-ui'
import { SConfirmByNameDialog } from '@kundancool/simple-ui'

const show = ref(false)
const message = ref('')

function done() {
    show.value = false
    message.value = 'Workspace disabled.'
}
</script>
