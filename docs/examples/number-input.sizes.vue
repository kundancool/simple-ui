<!-- demo: Every size — xs to lg steppers. -->
<template>
    <div class="space-y-4 max-w-sm">
        <s-number-input v-model="v" label="Extra small" size="xs" />
        <s-number-input v-model="v" label="Small" size="sm" />
        <s-number-input v-model="v" label="Medium" />
        <s-number-input v-model="v" label="Large" size="lg" />
        <s-number-input v-model="v" label="Extra large" size="xl" />
        <s-number-input v-model="v" label="Huge" size="2xl" />
        <s-number-input v-model="v" label="Giant" size="3xl" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { SNumberInput } from '@kundancool/simple-ui'

const v = ref(2)
</script>
