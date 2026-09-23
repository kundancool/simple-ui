<!-- demo: Every elevation — From flat none through hover-lift. -->
<template>
    <div class="grid sm:grid-cols-2 gap-3">
        <s-card title="None" shadow="none"><p class="text-sm s-text-secondary">Flat.</p></s-card>
        <s-card title="Small" shadow="sm"><p class="text-sm s-text-secondary">Default.</p></s-card>
        <s-card title="Medium" shadow="md"><p class="text-sm s-text-secondary">Lifted.</p></s-card>
        <s-card title="Hover" shadow="hover"><p class="text-sm s-text-secondary">Grows on hover.</p></s-card>
    </div>
</template>

<script setup>
import { SCard } from '@kundancool/simple-ui'
</script>
