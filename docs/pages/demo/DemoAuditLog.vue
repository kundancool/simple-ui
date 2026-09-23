<template>
    <div>
        <DemoStage title="Live audit log">
            <s-page-header class="mb-5" title="Audit log" subtitle="Who changed what, and when." />
            <s-card>
                <s-filter class="mb-4" v-model="query" placeholder="Search actor or action…" @search="noop">
                    <s-select v-model="severity" :options="severities" option-label="label" option-value="value" placeholder="All severities" clearable inline class="w-44" />
                </s-filter>
                <s-data-table :data="filtered" :stripe="false" size="small" empty-text="No matching events">
                    <s-data-table-column label="Severity" width="120px">
                        <template #default="{ row }"><s-tag :type="sevType(row.sev)" size="sm">{{ row.sev }}</s-tag></template>
                    </s-data-table-column>
                    <s-data-table-column prop="action" label="Action" />
                    <s-data-table-column prop="actor" label="Actor" width="160px" />
                    <s-data-table-column label="When" width="150px">
                        <template #default="{ row }"><s-relative-time :value="row.at" /></template>
                    </s-data-table-column>
                </s-data-table>
            </s-card>
        </DemoStage>
        <DemoSource file="DemoAuditLog.vue" />
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
import { SDataTable } from '@kundancool/simple-ui'
import { SDataTableColumn } from '@kundancool/simple-ui'
import { STag } from '@kundancool/simple-ui'
import { SRelativeTime } from '@kundancool/simple-ui'

const now = Date.now()
const events = [
    { sev: 'info', action: 'Priya updated pricing plan “Launch”', actor: 'priya@acme.test', at: now - 1000 * 60 * 9 },
    { sev: 'warning', action: '3 failed sign-in attempts for admin@acme.test', actor: 'system', at: now - 1000 * 60 * 41 },
    { sev: 'critical', action: 'API key “Legacy” used after revocation', actor: 'system', at: now - 1000 * 60 * 60 * 2 },
    { sev: 'info', action: 'Rahul exported July revenue report', actor: 'rahul@acme.test', at: now - 1000 * 60 * 60 * 5 },
    { sev: 'warning', action: 'Webhook endpoint failing (3/5)', actor: 'system', at: now - 1000 * 60 * 60 * 9 },
]
const severities = [
    { value: 'info', label: 'Info' },
    { value: 'warning', label: 'Warning' },
    { value: 'critical', label: 'Critical' },
]
const query = ref('')
const severity = ref('')

function sevType(sev) {
    return sev === 'critical' ? 'danger' : sev === 'warning' ? 'warning' : 'info'
}

const filtered = computed(() => {
    const q = query.value.trim().toLowerCase()
    return events.filter((e) => {
        if (severity.value && e.sev !== severity.value) {
            return false
        }
        return !q || e.action.toLowerCase().includes(q) || e.actor.toLowerCase().includes(q)
    })
})

function noop() {}
</script>
