<template>
    <s-checkbox v-model="agreed" label="I agree to the cancellation policy" />
    <s-checkbox v-model="notify" label="Notify me by SMS" />
    <s-checkbox :model-value="true" label="Disabled" disabled />
    <p class="text-sm s-text-muted">Agreed: {{ agreed ? 'yes' : 'no' }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SCheckbox } from '@kundancool/simple-ui'

const agreed = ref(false)
const notify = ref(true)
</script>
