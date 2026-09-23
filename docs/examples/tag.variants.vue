<!-- demo: Subtle, solid and outline — All three fills. -->
<template>
    <div class="flex flex-wrap items-center gap-2">
        <s-tag type="info">Subtle</s-tag>
        <s-tag type="info" variant="solid">Solid</s-tag>
        <s-tag type="info" variant="outline">Outline</s-tag>
        <s-tag type="success" variant="solid">Paid</s-tag>
        <s-tag type="danger" variant="outline">Overdue</s-tag>
    </div>
</template>

<script setup>
import { STag } from '@kundancool/simple-ui'
</script>
