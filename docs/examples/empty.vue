<template>
    <s-empty title="No orders yet" description="New orders will appear here as they come in." />
    <s-empty title="All caught up" description="Nothing needs your attention right now." class="mt-4">
        <s-button size="sm">New order</s-button>
    </s-empty>
</template>

<script setup>
import { SEmpty } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'
</script>
