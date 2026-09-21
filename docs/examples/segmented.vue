<template>
    <s-segmented v-model="billing" :options="[{ label: 'Monthly', value: 'm' }, { label: 'Yearly', value: 'y' }]" />
    <p class="text-sm s-text-muted mt-2">Billing: {{ billing === 'y' ? 'Yearly (2 months free)' : 'Monthly' }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SSegmented } from '@kundancool/simple-ui'

const billing = ref('m')
</script>
