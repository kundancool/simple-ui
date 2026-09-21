<template>
    <s-gallery :images="photos" :columns="3" />
</template>

<script setup>
import { SGallery } from '@kundancool/simple-ui'

const photos = [1, 2, 3].map((i) => ({
    src: `https://picsum.photos/seed/stay${i}/800/600`,
    alt: `Property photo ${i}`,
    caption: ['Infinity pool', 'Deluxe room', 'Lobby'][i - 1],
}))
</script>
