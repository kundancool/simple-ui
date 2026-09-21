<template>
    <s-button size="sm" variant="danger" @click="show = true">Disable property</s-button>
    <s-confirm-by-name-dialog v-model="show" title="Disable property" message="New bookings will be blocked immediately." expected="Seaside Villa" label="property" confirm-text="Disable property" @confirm="done" />
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
    message.value = 'Property disabled.'
}
</script>
