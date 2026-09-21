<template>
    <s-lightbox v-model:open="open" :images="photos" />
    <s-button size="sm" @click="open = true">Open gallery viewer</s-button>
</template>

<script setup>
import { ref } from 'vue'
import { SLightbox } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'

const open = ref(false)
const photos = [
    { src: 'https://picsum.photos/seed/stay1/1200/800', alt: 'Pool at dusk', caption: 'Infinity pool' },
    { src: 'https://picsum.photos/seed/stay2/1200/800', alt: 'Deluxe room', caption: 'Deluxe room' },
]
</script>
