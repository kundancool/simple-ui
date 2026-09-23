<!-- demo: Disabled on/off and loading — Every switch state. -->
<template>
    <div class="flex items-center gap-4">
        <s-switch :model-value="true" disabled aria-label="Disabled on" />
        <s-switch :model-value="false" disabled aria-label="Disabled off" />
        <s-switch :model-value="true" loading aria-label="Saving" />
    </div>
</template>

<script setup>
import { SSwitch } from '@kundancool/simple-ui'
</script>
