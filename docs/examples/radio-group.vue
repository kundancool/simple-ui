<template>
    <s-radio-group v-model="size" inline size="sm">
        <s-radio value="sm">Small</s-radio>
        <s-radio value="md">Medium</s-radio>
    </s-radio-group>
    <p class="text-sm s-text-muted mt-2">Selected: {{ size }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SRadioGroup } from '@kundancool/simple-ui'
import { SRadio } from '@kundancool/simple-ui'

const size = ref('md')
</script>
