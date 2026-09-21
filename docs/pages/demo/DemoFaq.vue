<template>
    <div>
        <DemoStage title="Live FAQ">
            <div class="max-w-2xl mx-auto text-center">
                <h1 class="text-xl font-bold s-text-primary">How can we help?</h1>
                <s-filter v-model="query" placeholder="Search answers…" class="mt-3 text-left" @search="noop" />
            </div>
            <s-accordion :items="filtered.map((f) => ({ key: f.q, title: f.q, text: f.a }))" :model-value="openKey" @update:model-value="openKey = $event" />
            <p v-if="!filtered.length" class="text-sm s-text-muted text-center mt-3">No answers match — try “refund”.</p>
        </DemoStage>
        <DemoSource file="DemoFaq.vue" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SFilter } from '@kundancool/simple-ui'
import { SAccordion } from '@kundancool/simple-ui'

const faqs = [
    { q: 'How do refunds work?', a: 'Full refunds up to 48 hours before the start date, automatic to the original payment method within 5–7 days.' },
    { q: 'Can I change dates after order?', a: 'Yes — modify dates from the order detail page. Fare differences apply.' },
    { q: 'Do you support tax invoices?', a: 'Every paid invoice includes tax details. Add your tax ID under Settings → Billing.' },
    { q: 'How does channel sync work?', a: 'Inventory pushes to all connected Channels within 60 seconds of any change.' },
]
const query = ref('')
const openKey = ref(null)

const filtered = computed(() => {
    const q = query.value.trim().toLowerCase()
    return faqs.filter((f) => !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q))
})

function noop() {}
</script>
