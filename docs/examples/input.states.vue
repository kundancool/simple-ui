<!-- demo: Error, disabled, readonly, clearable — Every field state. -->
<template>
    <div class="space-y-4 max-w-sm">
        <s-input v-model="bad" label="With error" error="Name is required." />
        <s-input v-model="off" label="Disabled" disabled />
        <s-input v-model="ro" label="Readonly" readonly />
        <s-input v-model="q" label="Clearable" clearable />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { SInput } from '@kundancool/simple-ui'

const bad = ref('')
const off = ref('')
const ro = ref('Cannot edit')
const q = ref('Clear me')
</script>
