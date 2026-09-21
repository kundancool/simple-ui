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
    { src: 'https://picsum.photos/seed/preview1/1200/800', alt: 'Reception at dusk', caption: 'Reception' },
    { src: 'https://picsum.photos/seed/preview2/1200/800', alt: 'Meeting room', caption: 'Meeting room' },
]
</script>
