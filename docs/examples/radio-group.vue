<template>
    <s-radio-group v-model="plan" inline>
        <s-radio value="basic">Basic</s-radio>
        <s-radio value="standard">Standard</s-radio>
        <s-radio value="premium">Premium</s-radio>
    </s-radio-group>
    <p class="mt-2 text-sm s-text-muted">Plan: {{ plan }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SRadioGroup } from '@kundancool/simple-ui'
import { SRadio } from '@kundancool/simple-ui'

const plan = ref('standard')
</script>
