<template>
    <s-gallery :images="photos" :columns="3" />
</template>

<script setup>
import { SGallery } from '@kundancool/simple-ui'

const photos = [1, 2, 3].map((i) => ({
    src: `https://picsum.photos/seed/preview${i}/800/600`,
    alt: `Workspace photo ${i}`,
    caption: ['Reception', 'Meeting room', 'Lounge'][i - 1],
}))
</script>
