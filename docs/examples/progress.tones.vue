<!-- demo: Every tone — All five progress colors. -->
<template>
    <div class="space-y-3 max-w-sm">
        <s-progress :value="68" tone="success" />
        <s-progress :value="35" tone="warning" />
        <s-progress :value="92" tone="danger" />
        <s-progress :value="50" tone="info" />
        <s-progress :value="20" tone="accent" />
    </div>
</template>

<script setup>
import { SProgress } from '@kundancool/simple-ui'
</script>
