<template>
    <div>
        <DemoStage title="Live roadmap">
            <s-page-header title="Roadmap" subtitle="Where the product is heading. Vote to shape it." />
            <div class="grid lg:grid-cols-3 gap-3">
                <s-card v-for="col in columns" :key="col.title" :title="`${col.title} (${col.items.length})`">
                    <div class="space-y-2">
                        <div v-for="item in col.items" :key="item.title" class="border s-border-theme rounded-lg p-3 s-bg-app">
                            <div class="flex items-center gap-2">
                                <p class="text-sm font-medium s-text-primary flex-1">{{ item.title }}</p>
                                <button
                                    type="button"
                                    class="s-focus-ring inline-flex items-center gap-1 text-xs font-medium rounded-full px-2 py-1 transition-colors"
                                    :class="item.voted ? 's-bg-accent-subtle s-text-accent' : 's-bg-surface-raised s-text-muted'"
                                    :aria-pressed="item.voted"
                                    @click="vote(item)"
                                >
                                    <ArrowUp class="w-3 h-3" />{{ item.votes + (item.voted ? 1 : 0) }}
                                </button>
                            </div>
                            <s-progress :value="item.progress" :tone="col.tone" size="sm" class="mt-2" />
                            <p class="text-[11px] s-text-muted mt-1">{{ item.progress }}% · {{ item.eta }}</p>
                        </div>
                    </div>
                </s-card>
            </div>
        </DemoStage>
        <DemoSource file="DemoRoadmap.vue" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowUp } from 'lucide-vue-next'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SPageHeader } from '@kundancool/simple-ui'
import { SCard } from '@kundancool/simple-ui'
import { SProgress } from '@kundancool/simple-ui'

const columns = ref([
    { title: 'Now', bar: 's-bg-success', tone: 'success', items: [
        { title: 'UPI AutoPay', votes: 214, voted: false, progress: 80, eta: 'Sep 2026' },
        { title: 'Tax e-invoices', votes: 167, voted: true, progress: 65, eta: 'Oct 2026' },
    ] },
    { title: 'Next', bar: 's-bg-warning', tone: 'warning', items: [
        { title: 'Multi-workspace calendar', votes: 189, voted: false, progress: 30, eta: 'Q4 2026' },
        { title: 'WhatsApp support', votes: 142, voted: false, progress: 15, eta: 'Q4 2026' },
    ] },
    { title: 'Later', bar: 's-bg-icon-blue-solid', tone: 'info', items: [
        { title: 'Revenue forecasting', votes: 98, voted: false, progress: 5, eta: '2027' },
        { title: 'White-label portals', votes: 76, voted: false, progress: 5, eta: '2027' },
    ] },
])

function vote(item) {
    item.voted = !item.voted
}
</script>
