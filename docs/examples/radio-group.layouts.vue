<!-- demo: Inline row vs stacked column — Both group layouts. -->
<template>
    <div class="space-y-4">
        <s-radio-group v-model="plan" inline>
            <s-radio value="basic">Inline</s-radio>
            <s-radio value="standard">Row</s-radio>
        </s-radio-group>
        <s-radio-group v-model="plan">
            <s-radio value="basic">Stacked</s-radio>
            <s-radio value="standard">Column</s-radio>
        </s-radio-group>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { SRadioGroup } from '@kundancool/simple-ui'
import { SRadio } from '@kundancool/simple-ui'

const plan = ref('basic')
</script>
