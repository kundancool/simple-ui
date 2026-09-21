<template>
    <div class="flex flex-wrap items-center gap-2">
        <s-tag>Default</s-tag>
        <s-tag type="success">Confirmed</s-tag>
        <s-tag type="warning">Pending</s-tag>
        <s-tag type="danger">Cancelled</s-tag>
        <s-tag type="info">OTA</s-tag>
    </div>
    <div class="flex flex-wrap items-center gap-2 mt-2">
        <s-tag type="success" variant="solid">Paid</s-tag>
        <s-tag type="danger" variant="outline">Overdue</s-tag>
        <s-tag type="info" size="sm">Small</s-tag>
        <s-tag color="#7c3aed">Custom</s-tag>
    </div>
</template>

<script setup>
import { STag } from '@kundancool/simple-ui'
</script>
