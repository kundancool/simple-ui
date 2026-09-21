<template>
    <div class="space-y-3 max-w-sm">
        <s-progress :value="68" tone="success" />
        <s-progress :value="35" tone="warning" size="sm" />
        <s-progress :value="92" />
    </div>
</template>

<script setup>
import { SProgress } from '@kundancool/simple-ui'
</script>
