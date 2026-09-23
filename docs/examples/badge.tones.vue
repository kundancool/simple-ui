<!-- demo: Tones, overflow and dot — Counts per tone, 99+ capping, and the bare dot. -->
<template>
    <div class="flex items-center gap-6">
        <s-badge :value="3"><s-button size="sm" variant="secondary">Inbox</s-button></s-badge>
        <s-badge :value="7" tone="success"><s-button size="sm" variant="secondary">Done</s-button></s-badge>
        <s-badge :value="2" tone="warning"><s-button size="sm" variant="secondary">Review</s-button></s-badge>
        <s-badge :value="128"><s-button size="sm" variant="secondary">Mentions</s-button></s-badge>
        <s-badge dot><span class="text-sm s-text-secondary">Settings</span></s-badge>
    </div>
</template>

<script setup>
import { SBadge } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'
</script>
