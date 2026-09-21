<template>
    <div class="flex items-center gap-4 text-sm">
        <span class="s-text-secondary">Updated <s-relative-time value="2026-09-12T06:30:00" /></span>
        <span class="s-text-secondary">Joined <s-relative-time :value="Date.now() - 1000 * 60 * 42" /></span>
    </div>
</template>

<script setup>
import { SRelativeTime } from '@kundancool/simple-ui'
</script>
