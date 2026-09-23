<!-- demo: Two vs four columns — Same photos, two densities. -->
<template>
    <div class="space-y-4">
        <s-gallery :images="photos" :columns="2" />
        <s-gallery :images="photos" :columns="4" />
    </div>
</template>

<script setup>
import { SGallery } from '@kundancool/simple-ui'

const photos = [1, 2, 3, 4].map((i) => ({
    src: `https://picsum.photos/seed/preview${i}/800/600`,
    alt: `Workspace photo ${i}`,
    caption: ['Reception', 'Meeting room', 'Lounge', 'Cafeteria'][i - 1],
}))
</script>
