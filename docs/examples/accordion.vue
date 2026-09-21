<template>
    <s-accordion :items="items" default-open />
</template>

<script setup>
import { SAccordion } from '@kundancool/simple-ui'

const items = [
    { key: 'refund', title: 'How do refunds work?', text: 'Full refunds up to 48 hours before the start date.' },
    { key: 'dates', title: 'Can I change dates?', text: 'Yes — fare differences apply.' },
    { key: 'tax', title: 'Do you support tax invoices?', text: 'Every paid invoice includes tax details.' },
]
</script>
