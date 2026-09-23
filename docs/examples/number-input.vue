<template>
    <s-number-input v-model="quantity" label="Quantity" :min="1" :max="6" />
    <p class="text-sm s-text-muted mt-2">Quantity: {{ quantity }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SNumberInput } from '@kundancool/simple-ui'

const quantity = ref(2)
</script>
