<template>
    <s-steps v-model="step" :steps="steps">
        <template #details><p class="text-sm s-text-secondary">Pick dates and rooms.</p></template>
        <template #guest><p class="text-sm s-text-secondary">Guest details form goes here.</p></template>
        <template #confirm><p class="text-sm s-text-secondary">Review and confirm.</p></template>
    </s-steps>
    <div class="flex gap-2 mt-3">
        <s-button size="sm" variant="secondary" @click="back">Back</s-button>
        <s-button size="sm" @click="next">Continue</s-button>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { SSteps } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'

const steps = [
    { key: 'details', label: 'Details' },
    { key: 'guest', label: 'Guest' },
    { key: 'confirm', label: 'Confirm' },
]
const step = ref('details')

function next() {
    const i = steps.findIndex((s) => s.key === step.value)
    if (i < steps.length - 1) {
        step.value = steps[i + 1].key
    }
}

function back() {
    const i = steps.findIndex((s) => s.key === step.value)
    if (i > 0) {
        step.value = steps[i - 1].key
    }
}
</script>
