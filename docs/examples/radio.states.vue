<!-- demo: Disabled option and standalone — An unavailable choice, plus radio without a group. -->
<template>
    <div class="space-y-4">
        <s-radio-group v-model="channel" inline>
            <s-radio value="direct">Direct</s-radio>
            <s-radio value="partner" disabled>Partner (unavailable)</s-radio>
        </s-radio-group>
        <s-radio v-model="standalone" value="yes">Standalone radio</s-radio>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { SRadioGroup } from '@kundancool/simple-ui'
import { SRadio } from '@kundancool/simple-ui'

const channel = ref('direct')
const standalone = ref('yes')
</script>
