<template>
    <div class="grid sm:grid-cols-2 gap-3">
        <s-card title="Shadows" shadow="md">
            <p class="text-sm s-text-secondary">Cards carry header, body and footer slots.</p>
            <template #footer><span class="text-xs s-text-muted">Footer bar</span></template>
        </s-card>
        <s-card title="Loading" :loading="true" />
    </div>
</template>

<script setup>
import { SCard } from '@kundancool/simple-ui'
</script>
