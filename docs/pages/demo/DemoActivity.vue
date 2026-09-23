<template>
    <div>
        <DemoStage title="Live activity feed">
        <s-page-header class="mb-5" title="Activity" subtitle="Everything happening across your workspace." refreshable :loading="loading" @refresh="reload" />
        <s-card>
            <s-filter class="mb-4" v-model="query" placeholder="Search activity..." @search="noop">
                <s-select v-model="kind" :options="kinds" option-label="label" option-value="value" placeholder="All types" clearable inline class="w-44" />
            </s-filter>
            <div v-if="loading" class="space-y-3">
                <s-skeleton :lines="4" />
            </div>
            <s-timeline v-else :items="timelineItems" />
            <s-alert v-if="!loading && !filtered.length" variant="info" title="Nothing here">No activity matches these filters.</s-alert>
        </s-card>
        </DemoStage>
        <DemoSource file="DemoActivity.vue" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SPageHeader } from '@kundancool/simple-ui'
import { SCard } from '@kundancool/simple-ui'
import { SFilter } from '@kundancool/simple-ui'
import { SSelect } from '@kundancool/simple-ui'
import { STimeline } from '@kundancool/simple-ui'
import { SSkeleton } from '@kundancool/simple-ui'
import { SAlert } from '@kundancool/simple-ui'

const now = Date.now()
const events = ref([
    { id: 1, kind: 'Order', tone: 'success', text: 'ORD-104 confirmed for Meera Iyer', actor: 'Direct', at: now - 1000 * 60 * 4 },
    { id: 2, kind: 'Payment', tone: 'success', text: '₹6,100 received via virtual card', actor: 'Marketplace', at: now - 1000 * 60 * 26 },
    { id: 3, kind: 'Alert', tone: 'warning', text: 'Item 204 conflicting for tonight', actor: 'System', at: now - 1000 * 60 * 58 },
    { id: 4, kind: 'User', tone: 'info', text: 'Priya Nair updated pricing plan “Launch”', actor: 'Priya Nair', at: now - 1000 * 60 * 60 * 3 },
    { id: 5, kind: 'Sync', tone: 'danger', text: 'Reseller sync failed — retrying', actor: 'System', at: now - 1000 * 60 * 60 * 7 },
    { id: 6, kind: 'Review', tone: 'info', text: 'New 5★ review from Kabir Singh', actor: 'Partner', at: now - 1000 * 60 * 60 * 26 },
])

const kinds = [
    { value: 'Order', label: 'Orders' },
    { value: 'Payment', label: 'Payments' },
    { value: 'Alert', label: 'Alerts' },
    { value: 'User', label: 'Users' },
    { value: 'Sync', label: 'Sync' },
    { value: 'Review', label: 'Reviews' },
]

const query = ref('')
const kind = ref('')
const loading = ref(false)

function timeAgo(at) {
    const diff = Date.now() - at
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) {
        return 'just now'
    }
    if (minutes < 60) {
        return `${minutes}m ago`
    }
    const hours = Math.floor(minutes / 60)
    if (hours < 24) {
        return `${hours}h ago`
    }
    return `${Math.floor(hours / 24)}d ago`
}

const timelineItems = computed(() =>
    filtered.value.map((e) => ({
        title: e.text,
        description: e.actor,
        time: timeAgo(e.at),
        tag: e.kind,
        tone: e.tone,
    })),
)

const filtered = computed(() => {
    const q = query.value.trim().toLowerCase()
    return events.value.filter((e) => {
        if (kind.value && e.kind !== kind.value) {
            return false
        }
        if (q && !(e.text.toLowerCase().includes(q) || e.actor.toLowerCase().includes(q))) {
            return false
        }
        return true
    })
})

function noop() {}
function reload() {
    loading.value = true
    setTimeout(() => {
        loading.value = false
    }, 600)
}
</script>
