<template>
    <s-select v-model="ota" label="OTA" :options="otas" filterable clearable />
    <s-multi-select v-model="rooms" label="Room types" :options="roomTypes" />
    <p class="text-sm s-text-secondary">OTA: {{ ota || '—' }} · Rooms: {{ rooms.join(', ') || '—' }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SSelect } from '@kundancool/simple-ui'
import { SMultiSelect } from '@kundancool/simple-ui'

const ota = ref('')
const rooms = ref([])
const otas = [
    { id: 'direct', name: 'Direct' },
    { id: 'mmt', name: 'MakeMyTrip' },
    { id: 'booking', name: 'Booking.com' },
]
const roomTypes = [
    { id: 1, name: 'Deluxe' },
    { id: 2, name: 'Suite' },
    { id: 3, name: 'Standard' },
]
</script>
