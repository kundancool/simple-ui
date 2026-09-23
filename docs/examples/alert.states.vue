<!-- demo: Dismissible alerts — Alerts with a close button that emits dismiss. -->
<template>
    <div class="space-y-2">
        <s-alert variant="warning" dismissible v-if="warned" @dismiss="warned = false">Dismiss me — the close button emits <code>dismiss</code>.</s-alert>
        <s-button size="sm" variant="secondary" @click="warned = true">Show again</s-button>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { SAlert } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'

const warned = ref(true)
</script>
