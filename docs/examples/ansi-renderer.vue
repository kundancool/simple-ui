<template>
    <s-ansi-renderer :value="log" />
</template>

<script setup>
import { ref } from 'vue'
import { SAnsiRenderer } from '@kundancool/simple-ui'

const log = ref('\x1b[32m[ok]\x1b[0m synced 128 bookings\n\x1b[33m[warn]\x1b[0m 3 rooms overbooked\n\x1b[31m[err]\x1b[0m card declined (TMZ-002)')
</script>
