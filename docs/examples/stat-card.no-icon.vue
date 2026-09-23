<!-- demo: Without icons — Text-only stats, no tile, same rhythm. -->
<template>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <s-stat-card value="128" label="Total orders" />
        <s-stat-card value="₹48,210" label="Revenue" />
        <s-stat-card value="23" label="Pending" />
        <s-stat-card value="4.8" label="Rating" />
    </div>
</template>

<script setup>
import { SStatCard } from '@kundancool/simple-ui'
</script>
