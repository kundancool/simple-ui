<!-- demo: Disabled and error — Non-interactive and invalid states. -->
<template>
    <div class="space-y-3">
        <s-checkbox v-model="notify" label="Notify me by SMS" />
        <s-checkbox :model-value="true" label="Disabled" disabled />
        <s-checkbox v-model="bad" label="With error" error="Required." />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { SCheckbox } from '@kundancool/simple-ui'

const notify = ref(true)
const bad = ref(false)
</script>
