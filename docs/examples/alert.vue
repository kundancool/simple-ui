<template>
    <div class="space-y-2">
        <s-alert variant="info" title="Sync running">Channel manager sync started 2 minutes ago.</s-alert>
        <s-alert variant="success">All 128 bookings imported.</s-alert>
        <s-alert variant="warning" dismissible @dismiss="warned = false" v-if="warned">3 rooms are overbooked for tonight.</s-alert>
        <s-alert variant="danger" title="Payment failed">The OTA virtual card was declined.</s-alert>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { SAlert } from '@kundancool/simple-ui'

const warned = ref(true)
</script>
