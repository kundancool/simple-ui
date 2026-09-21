<template>
    <div class="grid lg:grid-cols-[1fr_200px] gap-6 items-start">
        <div>
            <s-section-heading eyebrow="Docs" title="Theming" />
            <p class="text-sm s-text-secondary mt-2">Overridden by page content in real usage — this demo shows the TOC alone.</p>
        </div>
        <s-toc :items="[{ id: 'a', label: 'Install' }, { id: 'b', label: 'Theming' }, { id: 'c', label: 'Dark mode' }]" />
    </div>
</template>

<script setup>
import { SToc } from '@kundancool/simple-ui'
import { SSectionHeading } from '@kundancool/simple-ui'
</script>
