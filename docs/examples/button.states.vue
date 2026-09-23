<!-- demo: Loading and disabled — Spinner inside the button, and non-interactive buttons. -->
<template>
    <div class="flex flex-wrap gap-2">
        <s-button :loading="true">Saving</s-button>
        <s-button disabled>Disabled</s-button>
        <s-button variant="secondary" disabled>Disabled</s-button>
    </div>
</template>

<script setup>
import { SButton } from '@kundancool/simple-ui'
</script>
