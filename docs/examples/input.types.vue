<!-- demo: Password and textarea — Reveal toggle and multi-line input. -->
<template>
    <div class="space-y-4 max-w-sm">
        <s-input v-model="password" label="Password" type="password" />
        <s-input v-model="notes" label="Notes" type="textarea" hint="Visible to the team only." />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { SInput } from '@kundancool/simple-ui'

const password = ref('')
const notes = ref('')
</script>
