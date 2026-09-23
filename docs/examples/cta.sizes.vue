<!-- demo: Both sizes — Medium default and large for landing pages. -->
<template>
    <div class="space-y-4">
        <s-cta eyebrow="Get started" title="Medium CTA." description="The default size.">
            <s-button size="sm">Open live demo</s-button>
        </s-cta>
        <s-cta eyebrow="Get started" title="Large CTA." description="More presence for landing pages." size="lg">
            <s-button>Open live demo</s-button>
        </s-cta>
    </div>
</template>

<script setup>
import { SCta } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'
</script>
