<!-- demo: Above and below — Both supported placements. -->
<template>
    <div class="flex flex-wrap gap-6">
        <s-hover-popover placement="top">
            <s-tag type="info">Above</s-tag>
            <template #content><p class="text-sm">Opens above the trigger.</p></template>
        </s-hover-popover>
        <s-hover-popover placement="bottom">
            <s-tag type="info">Below</s-tag>
            <template #content><p class="text-sm">Opens below the trigger.</p></template>
        </s-hover-popover>
    </div>
</template>

<script setup>
import { SHoverPopover } from '@kundancool/simple-ui'
import { STag } from '@kundancool/simple-ui'
</script>
