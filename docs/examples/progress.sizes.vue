<!-- demo: Both heights — Slim and default bars. -->
<template>
    <div class="space-y-3 max-w-sm">
        <s-progress :value="68" size="sm" />
        <s-progress :value="68" />
        <s-progress :value="68" size="lg" />
        <s-progress :value="68" size="xl" />
        <s-progress :value="68" size="2xl" />
        <s-progress :value="68" size="3xl" />
    </div>
</template>

<script setup>
import { SProgress } from '@kundancool/simple-ui'
</script>
