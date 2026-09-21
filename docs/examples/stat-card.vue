<template>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <s-stat-card :icon="CalendarCheck" bg-color="s-bg-icon-blue" icon-color="s-text-icon-blue" value="128" label="Total bookings" />
        <s-stat-card :icon="Wallet" bg-color="s-bg-icon-green" icon-color="s-text-icon-green" value="₹48,210" label="Revenue" />
        <s-stat-card :icon="Hourglass" bg-color="s-bg-icon-yellow" icon-color="s-text-icon-yellow" value="23" label="Pending" />
        <s-stat-card :icon="Star" bg-color="s-bg-icon-purple" icon-color="s-text-icon-purple" value="4.8" label="Rating" />
    </div>
</template>

<script setup>
import { CalendarCheck, Wallet, Hourglass, Star } from 'lucide-vue-next'
import { SStatCard } from '@kundancool/simple-ui'
</script>
