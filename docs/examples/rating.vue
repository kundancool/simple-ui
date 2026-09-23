<template>
    <s-rating v-model="score" />
    <p class="text-sm s-text-muted mt-2">Your rating: {{ score || '—' }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SRating } from '@kundancool/simple-ui'

const score = ref(4)
</script>
