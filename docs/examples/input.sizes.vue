<!-- demo: Every size — xs to lg — matching selects in a row. -->
<template>
    <div class="space-y-4 max-w-sm">
        <s-input v-model="v" label="Extra small" size="xs" />
        <s-input v-model="v" label="Small" size="sm" />
        <s-input v-model="v" label="Medium" />
        <s-input v-model="v" label="Large" size="lg" />
        <s-input v-model="v" label="Extra large" size="xl" />
        <s-input v-model="v" label="Huge" size="2xl" />
        <s-input v-model="v" label="Giant" size="3xl" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { SInput } from '@kundancool/simple-ui'

const v = ref('')
</script>
