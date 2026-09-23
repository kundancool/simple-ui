<!-- demo: Readonly score and accent color — Display-only rating and the accent color. -->
<template>
    <div class="flex items-center gap-6">
        <s-rating :model-value="4" readonly size="sm" />
        <s-rating v-model="score" color="accent" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { SRating } from '@kundancool/simple-ui'

const score = ref(3)
</script>
