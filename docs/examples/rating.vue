<template>
    <div class="flex items-center gap-6">
        <s-rating v-model="score" />
        <s-rating :model-value="4" readonly size="sm" />
    </div>
    <p class="text-sm s-text-muted mt-2">Your rating: {{ score || '—' }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SRating } from '@kundancool/simple-ui'

const score = ref(4)
</script>
