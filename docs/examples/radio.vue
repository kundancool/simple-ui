<template>
    <s-radio-group v-model="channel" inline>
        <s-radio value="direct">Direct</s-radio>
        <s-radio value="marketplace">Marketplace</s-radio>
    </s-radio-group>
    <p class="mt-2 text-sm s-text-muted">Channel: {{ channel }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SRadioGroup } from '@kundancool/simple-ui'
import { SRadio } from '@kundancool/simple-ui'

const channel = ref('direct')
</script>
