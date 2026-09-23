<template>
    <s-upload
        action="/uploads"
        accept="image/*"
        tip="PNG or JPG, up to 5MB — the demo posts nowhere, so it just reports."
        @change="picked = $event.length"
        @success="uploaded = true"
    />
    <p class="mt-2 text-sm s-text-muted">Files picked: {{ picked }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SUpload } from '@kundancool/simple-ui'

const picked = ref(0)
const uploaded = ref(false)
</script>
