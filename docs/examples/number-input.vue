<template>
    <div class="flex flex-wrap items-end gap-4">
        <s-number-input v-model="adults" label="Adults" :min="1" :max="6" />
        <s-number-input v-model="rooms" label="Rooms" :min="1" :max="4" wrapper="inline" />
    </div>
    <p class="text-sm s-text-muted mt-2">Adults: {{ adults }} · Rooms: {{ rooms }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SNumberInput } from '@kundancool/simple-ui'

const adults = ref(2)
const rooms = ref(1)
</script>
