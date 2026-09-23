<!-- demo: All five tones — Every tag color. -->
<template>
    <div class="flex flex-wrap items-center gap-2">
        <s-tag>Default</s-tag>
        <s-tag type="success">Confirmed</s-tag>
        <s-tag type="warning">Pending</s-tag>
        <s-tag type="danger">Cancelled</s-tag>
        <s-tag type="info">Channel</s-tag>
    </div>
</template>

<script setup>
import { STag } from '@kundancool/simple-ui'
</script>
