<template>
    <s-hover-popover>
        <s-tag type="info">12 customers</s-tag>
        <template #content>
            <p class="text-sm s-text-primary font-medium mb-1">Utilization breakdown</p>
            <p class="text-xs s-text-secondary">Active: 8 · Pending: 4</p>
            <p class="text-xs s-text-secondary">Items: 204, 205, 207</p>
        </template>
    </s-hover-popover>
</template>

<script setup>
import { SHoverPopover } from '@kundancool/simple-ui'
import { STag } from '@kundancool/simple-ui'
</script>
