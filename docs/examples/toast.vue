<template>
    <div class="flex flex-wrap gap-2">
        <s-button size="sm" @click="success('Order confirmed')">Success</s-button>
        <s-button size="sm" variant="secondary" @click="error('Payment failed')">Error</s-button>
        <s-button size="sm" variant="ghost" @click="info('Sync started in background')">Info</s-button>
    </div>
    <s-toast-container />
</template>

<script setup>
import { SButton } from '@kundancool/simple-ui'
import { SToastContainer } from '@kundancool/simple-ui'
import { useToast } from '@kundancool/simple-ui'

const { success, error, info } = useToast()
</script>
