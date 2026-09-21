<template>
    <s-marquee aria-label="Component tags">
        <span v-for="t in ['s-input', 's-table', 's-dialog', 's-chart']" :key="t" class="font-mono text-xs s-text-secondary px-3 py-1 rounded-full border s-border-theme s-bg-surface-raised">&lt;{{ t }}&gt;</span>
    </s-marquee>
</template>

<script setup>
import { SMarquee } from '@kundancool/simple-ui'
</script>
