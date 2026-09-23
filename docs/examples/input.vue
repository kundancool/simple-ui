<template>
    <s-input v-model="name" label="Customer name" placeholder="Full name" required />
    <p class="mt-2 text-sm s-text-secondary">Value: {{ name || '—' }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SInput } from '@kundancool/simple-ui'

const name = ref('')
</script>
