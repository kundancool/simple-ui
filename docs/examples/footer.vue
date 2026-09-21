<template>
    <s-footer
        brand-name="Acme Inc"
        tagline="Periods, minus the chaos."
        :columns="[
            { heading: 'Docs', links: [{ label: 'Install' }, { label: 'Components' }] },
            { heading: 'Demo', links: [{ label: 'Dashboard' }, { label: 'Pricing' }] },
        ]"
        bottom-note="© 2026 Acme · MIT"
    />
</template>

<script setup>
import { SFooter } from '@kundancool/simple-ui'
</script>
