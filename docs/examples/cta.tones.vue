<!-- demo: Both tones — Quiet surface panel vs loud accent panel. -->
<template>
    <div class="space-y-4">
        <s-cta eyebrow="Surface" title="Quiet panel." description="Blends into the page.">
            <s-button size="sm" variant="secondary">Read the docs</s-button>
        </s-cta>
        <s-cta eyebrow="Accent" title="Loud panel." description="Draws the eye." tone="accent">
            <s-button size="sm">Open live demo</s-button>
        </s-cta>
    </div>
</template>

<script setup>
import { SCta } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'
</script>
