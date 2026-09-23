<template>
    <s-checkbox v-model="agreed" label="I agree to the cancellation policy" />
    <p class="mt-2 text-sm s-text-muted">Agreed: {{ agreed ? 'yes' : 'no' }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SCheckbox } from '@kundancool/simple-ui'

const agreed = ref(false)
</script>
