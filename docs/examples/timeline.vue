<template>
    <s-timeline :items="items" />
</template>

<script setup>
import { STimeline } from '@kundancool/simple-ui'

const items = [
    { title: 'Booking confirmed', time: '2m ago', tag: 'Booking', tone: 'success' },
    { title: 'Payment received', description: '₹6,100 via virtual card', time: '26m ago', tag: 'Payment', tone: 'success' },
    { title: 'Room overbooked', time: '1h ago', tag: 'Alert', tone: 'warning' },
]
</script>
