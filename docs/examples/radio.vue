<template>
    <s-radio-group v-model="channel" inline>
        <s-radio value="direct">Direct</s-radio>
        <s-radio value="marketplace">Marketplace</s-radio>
        <s-radio value="partner" disabled>Partner (unavailable)</s-radio>
    </s-radio-group>
    <p class="text-sm s-text-muted">Channel: {{ channel }}</p>
    <div class="mt-3">
        <s-radio v-model="standalone" value="yes">Standalone radio</s-radio>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { SRadioGroup } from '@kundancool/simple-ui'
import { SRadio } from '@kundancool/simple-ui'

const channel = ref('marketplace')
const standalone = ref('yes')
</script>
