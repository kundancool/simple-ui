<template>
    <s-newsletter title="Changelog in your inbox" description="One email per release, never spam." @submit="subscribed = true" />
    <s-newsletter title="Centered capture" description="One email per release." align="center" class="mt-4" @submit="subscribed = true" />
    <p v-if="subscribed" class="text-sm s-text-success mt-2">Subscribed — check the demo toast too.</p>
</template>

<script setup>
import { ref } from 'vue'
import { SNewsletter } from '@kundancool/simple-ui'

const subscribed = ref(false)
</script>
