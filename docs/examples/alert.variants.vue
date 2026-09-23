<!-- demo: All four tones — Info, success, warning and danger — with and without titles. -->
<template>
    <div class="space-y-2">
        <s-alert variant="info" title="Sync running">Channel manager sync started 2 minutes ago.</s-alert>
        <s-alert variant="success">All 128 orders imported.</s-alert>
        <s-alert variant="warning">3 items are conflicting.</s-alert>
        <s-alert variant="danger" title="Payment failed">The virtual card was declined.</s-alert>
    </div>
</template>

<script setup>
import { SAlert } from '@kundancool/simple-ui'
</script>
