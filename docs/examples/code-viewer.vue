<template>
    <s-code-viewer :value="payload" language="json" label="Webhook payload" />
</template>

<script setup>
import { ref } from 'vue'
import { SCodeViewer } from '@kundancool/simple-ui'

const payload = ref(JSON.stringify({ event: 'order.confirmed', order_no: 'ORD-001', total: 4200 }, null, 2))
</script>
