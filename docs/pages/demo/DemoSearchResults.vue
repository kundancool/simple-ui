<template>
    <div>
        <DemoStage title="Live site search">
            <div class="max-w-2xl mx-auto">
                <s-filter class="mb-4" v-model="query" placeholder="Search orders, customers, invoices…" @search="noop" />
                <p class="text-xs s-text-muted mb-2">{{ results.length }} result{{ results.length === 1 ? '' : 's' }}{{ query ? ` for “${query}”` : '' }}</p>
                <div class="space-y-2">
                    <button
                        v-for="r in results"
                        :key="r.id"
                        type="button"
                        class="s-focus-ring s-result-btn w-full text-left border s-border-theme rounded-xl p-3 s-bg-surface transition-colors"
                        @click="notify(`${r.kind}: ${r.title}`)"
                    >
                        <span class="flex items-center gap-2">
                            <s-tag :type="r.tone" size="sm">{{ r.kind }}</s-tag>
                            <span class="text-sm font-medium s-text-primary truncate">{{ r.title }}</span>
                        </span>
                        <span class="block text-xs s-text-muted mt-1 truncate">{{ r.snippet }}</span>
                    </button>
                </div>
                <s-empty v-if="!results.length" title="No matches" description="Try “invoice”, “services” or “204”." />
            </div>
        </DemoStage>
        <DemoSource file="DemoSearchResults.vue" />
        <s-toast-container />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SFilter } from '@kundancool/simple-ui'
import { STag } from '@kundancool/simple-ui'
import { SEmpty } from '@kundancool/simple-ui'
import { SToastContainer } from '@kundancool/simple-ui'
import { useToast } from '@kundancool/simple-ui'

const { info } = useToast()
const index = [
    { id: 1, kind: 'Order', tone: 'success', title: 'ORD-101 · Aarav Sharma', snippet: 'Basic item · 12–14 Sep · ₹4,200' },
    { id: 2, kind: 'Invoice', tone: 'warning', title: 'INV-2026-0841 · ₹14,278 unpaid', snippet: 'Due 26 Sep · Aarav Sharma' },
    { id: 3, kind: 'Item', tone: 'info', title: 'SKU-204 · Basic', snippet: 'Back in stock Sunday · late delivery approved' },
    { id: 4, kind: 'Service', tone: 'info', title: 'Extended warranty · ₹2,500', snippet: 'Service add-on · 40 in stock' },
    { id: 5, kind: 'Order', tone: 'danger', title: 'ORD-099 · Cancelled', snippet: 'Refunded ₹3,100 to virtual card' },
]
const query = ref('')

const results = computed(() => {
    const q = query.value.trim().toLowerCase()
    return index.filter((r) => !q || `${r.kind} ${r.title} ${r.snippet}`.toLowerCase().includes(q))
})

function notify(message) {
    info(message)
}

function noop() {}
</script>

<style>
.s-result-btn:hover {
    border-color: var(--s-accent-border);
}
</style>
