<template>
    <s-select v-model="status" label="Status" filterable clearable>
        <s-option label="Open" value="open" />
        <s-option label="In progress" value="progress" />
        <s-option label="Blocked" value="blocked" />
        <s-option label="Archived" value="archived" disabled />
    </s-select>
    <p class="text-sm s-text-muted">Status: {{ status || '—' }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { SSelect } from '@kundancool/simple-ui'
import { SOption } from '@kundancool/simple-ui'

const status = ref('open')
</script>
