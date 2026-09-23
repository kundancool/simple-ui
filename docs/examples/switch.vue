<template>
    <div class="flex items-center gap-4">
        <label class="flex items-center gap-2 text-sm s-text-secondary">
            <s-switch v-model="a" aria-label="Email notifications" /> Email
        </label>
        <label class="flex items-center gap-2 text-sm s-text-secondary">
            <s-switch v-model="b" aria-label="SMS alerts" /> SMS
        </label>
    </div>
    <p class="text-sm s-text-muted mt-2">Email {{ a ? 'on' : 'off' }} · SMS {{ b ? 'on' : 'off' }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SSwitch } from '@kundancool/simple-ui'

const a = ref(true)
const b = ref(false)
</script>
