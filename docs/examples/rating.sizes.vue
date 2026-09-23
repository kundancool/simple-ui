<!-- demo: Every size — Small to large stars. -->
<template>
    <div class="flex items-center gap-6">
        <s-rating v-model="score" size="xs" />
        <s-rating v-model="score" size="sm" />
        <s-rating v-model="score" />
        <s-rating v-model="score" size="lg" />
        <s-rating v-model="score" size="xl" />
        <s-rating v-model="score" size="2xl" />
        <s-rating v-model="score" size="3xl" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { SRating } from '@kundancool/simple-ui'

const score = ref(4)
</script>
