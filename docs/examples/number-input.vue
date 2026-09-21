<template>
    <div class="flex flex-wrap items-end gap-4">
        <s-number-input v-model="quantity" label="Quantity" :min="1" :max="6" />
        <s-number-input v-model="items" label="Items" :min="1" :max="4" wrapper="inline" />
    </div>
    <p class="text-sm s-text-muted mt-2">Quantity: {{ quantity }} · Items: {{ items }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SNumberInput } from '@kundancool/simple-ui'

const quantity = ref(2)
const items = ref(1)
</script>
