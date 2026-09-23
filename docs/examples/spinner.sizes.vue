<!-- demo: Every size, plus labeled — xs to lg, and a spinner with text. -->
<template>
    <div class="flex items-center gap-4">
        <s-spinner size="xs" />
        <s-spinner size="sm" />
        <s-spinner />
        <s-spinner size="lg" />
        <s-spinner size="lg" label="Loading orders" />
        <s-spinner size="xl" />
        <s-spinner size="2xl" />
        <s-spinner size="3xl" />
    </div>
</template>

<script setup>
import { SSpinner } from '@kundancool/simple-ui'
</script>
