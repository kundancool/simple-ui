<template>
    <div class="flex flex-wrap gap-2">
        <s-button>Primary</s-button>
        <s-button variant="secondary">Secondary</s-button>
        <s-button variant="danger">Danger</s-button>
        <s-button variant="ghost">Ghost</s-button>
        <s-button variant="link">Link</s-button>
        <s-button :loading="true">Saving</s-button>
        <s-button size="sm">Small</s-button>
    </div>
</template>

<script setup>
import { SButton } from '@kundancool/simple-ui'
</script>
