<template>
    <s-hover-popover>
        <s-tag type="info">12 guests</s-tag>
        <template #content>
            <p class="text-sm s-text-primary font-medium mb-1">Occupancy breakdown</p>
            <p class="text-xs s-text-secondary">Adults: 8 · Children: 4</p>
            <p class="text-xs s-text-secondary">Rooms: 204, 205, 207</p>
        </template>
    </s-hover-popover>
</template>

<script setup>
import { SHoverPopover } from '@kundancool/simple-ui'
import { STag } from '@kundancool/simple-ui'
</script>
