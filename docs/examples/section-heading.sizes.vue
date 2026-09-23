<!-- demo: Medium vs large — Both heading sizes. -->
<template>
    <div class="space-y-4">
        <s-section-heading eyebrow="Medium" title="Everything a dashboard needs" />
        <s-section-heading eyebrow="Large" title="Everything a dashboard needs" size="lg" />
        <s-section-heading eyebrow="Extra large" title="Everything a dashboard needs" size="xl" />
        <s-section-heading eyebrow="Huge" title="Everything a dashboard needs" size="2xl" />
        <s-section-heading eyebrow="Giant" title="Everything a dashboard needs" size="3xl" />
    </div>
</template>

<script setup>
import { SSectionHeading } from '@kundancool/simple-ui'
</script>
