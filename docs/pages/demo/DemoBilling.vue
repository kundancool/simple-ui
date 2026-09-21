<template>
    <div>
        <DemoStage title="Live billing">
            <s-page-header title="Billing" subtitle="Plan, card and invoice history." />
            <div class="grid lg:grid-cols-3 gap-3">
                <s-card title="Current plan">
                    <p class="text-lg font-bold s-text-primary">Growth <span class="text-xs font-medium s-text-muted">· yearly</span></p>
                    <p class="text-sm s-text-secondary mt-1">Renews 1 Jan 2027 · ₹14,988/yr</p>
                    <div class="flex gap-2 mt-3">
                        <s-button size="sm" variant="secondary" @click="notify('Plan picker opening (demo).')">Change plan</s-button>
                        <s-button size="sm" variant="ghost" @click="notify('Cancellation scheduled (demo).')">Cancel</s-button>
                    </div>
                </s-card>
                <s-card title="Payment method">
                    <div class="flex items-center gap-3">
                        <span class="px-2.5 py-1.5 rounded-md s-bg-surface-raised font-mono text-xs font-bold s-text-primary">VISA</span>
                        <div><p class="text-sm font-medium s-text-primary">•••• 4242</p><p class="text-xs s-text-muted">Expires 08/28</p></div>
                    </div>
                    <s-button size="sm" variant="secondary" class="mt-3" @click="notify('Card form opening (demo).')">Update card</s-button>
                </s-card>
                <s-card title="Usage">
                    <p class="text-lg font-bold s-text-primary">7 <span class="text-xs font-medium s-text-muted">/ 10 workspaces</span></p>
                    <s-progress :value="70" class="mt-2" />
                    <p class="text-xs s-text-muted mt-2">3 slots left on Growth</p>
                </s-card>
            </div>
            <s-card title="Invoices" class="mt-3">
                <s-data-table :data="invoices" :stripe="false" size="small">
                    <s-data-table-column prop="id" label="Invoice" width="140px" />
                    <s-data-table-column prop="date" label="Date" width="120px" />
                    <s-data-table-column prop="amount" label="Amount" align="right" width="110px" />
                    <s-data-table-column label="Status" width="120px">
                        <template #default="{ row }"><s-tag :type="row.paid ? 'success' : 'warning'" size="sm">{{ row.paid ? 'Paid' : 'Due' }}</s-tag></template>
                    </s-data-table-column>
                </s-data-table>
            </s-card>
        </DemoStage>
        <DemoSource file="DemoBilling.vue" />
        <s-toast-container />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SPageHeader } from '@kundancool/simple-ui'
import { SCard } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'
import { SProgress } from '@kundancool/simple-ui'
import { SDataTable } from '@kundancool/simple-ui'
import { SDataTableColumn } from '@kundancool/simple-ui'
import { STag } from '@kundancool/simple-ui'
import { SToastContainer } from '@kundancool/simple-ui'
import { useToast } from '@kundancool/simple-ui'

const { info } = useToast()
const invoices = ref([
    { id: 'INV-0841', date: 'Aug 2026', amount: '₹1,249', paid: true },
    { id: 'INV-0802', date: 'Jul 2026', amount: '₹1,249', paid: true },
    { id: 'INV-0880', date: 'Sep 2026', amount: '₹1,249', paid: false },
])

function notify(message) {
    info(message)
}
</script>
