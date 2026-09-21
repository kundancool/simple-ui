<template>
    <s-input v-model="name" label="Customer name" placeholder="Full name" required />
    <s-input v-model="notes" label="Notes" type="textarea" hint="Visible to front-desk only." />
    <s-input v-model="bad" label="With error" error="Name is required." />
    <p class="text-sm s-text-secondary">Value: {{ name || '—' }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SInput } from '@kundancool/simple-ui'

const name = ref('')
const notes = ref('')
const bad = ref('')
</script>
