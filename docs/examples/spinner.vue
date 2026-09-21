<template>
    <div class="flex items-center gap-4">
        <s-spinner size="xs" />
        <s-spinner size="sm" />
        <s-spinner />
        <s-spinner size="lg" />
        <s-spinner size="lg" label="Loading orders" />
    </div>
</template>

<script setup>
import { SSpinner } from '@kundancool/simple-ui'
</script>
