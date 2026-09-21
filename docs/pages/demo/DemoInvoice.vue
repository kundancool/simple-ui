<template>
    <div>
        <DemoStage title="Live invoice">
            <s-card>
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <p class="text-lg font-bold s-text-primary">INV-2026-0841</p>
                        <p class="text-xs s-text-muted mt-0.5">Issued 12 Sep 2026 · Due 26 Sep 2026</p>
                    </div>
                    <s-tag type="warning">Unpaid</s-tag>
                </div>
                <s-descriptions
                    class="mt-4"
                    :items="[
                        { label: 'Billed to', value: 'Aarav Sharma · aarav@example.test' },
                        { label: 'From', value: 'Acme Stays · billing@acme.test' },
                    ]"
                />
                <s-data-table :data="lines" :stripe="false" size="small" class="mt-4">
                    <s-data-table-column prop="desc" label="Description" />
                    <s-data-table-column prop="qty" label="Qty" width="70px" align="center" />
                    <s-data-table-column prop="amount" label="Amount" align="right" width="120px" />
                </s-data-table>
                <div class="flex justify-end mt-3">
                    <div class="w-56 space-y-1 text-sm">
                        <p class="flex justify-between s-text-secondary"><span>Subtotal</span><span class="s-text-primary">₹12,100</span></p>
                        <p class="flex justify-between s-text-secondary"><span>Tax (18%)</span><span class="s-text-primary">₹2,178</span></p>
                        <p class="flex justify-between font-bold s-text-primary text-base pt-1 border-t s-border-theme"><span>Total</span><span>₹14,278</span></p>
                    </div>
                </div>
                <div class="flex flex-wrap gap-2 mt-4">
                    <s-button size="sm" @click="paid = true">Mark as paid</s-button>
                    <s-button size="sm" variant="secondary" @click="notify('Invoice downloaded (demo).')">Download PDF</s-button>
                    <s-copy value="INV-2026-0841 · ₹14,278 · due 26 Sep 2026" />
                </div>
                <s-alert v-if="paid" variant="success" title="Marked as paid" class="mt-3">Receipt sent to the customer.</s-alert>
            </s-card>
        </DemoStage>
        <DemoSource file="DemoInvoice.vue" />
        <s-toast-container />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SCard } from '@kundancool/simple-ui'
import { STag } from '@kundancool/simple-ui'
import { SDataTable } from '@kundancool/simple-ui'
import { SDataTableColumn } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'
import { SCopy } from '@kundancool/simple-ui'
import { SAlert } from '@kundancool/simple-ui'
import { SDescriptions } from '@kundancool/simple-ui'
import { SToastContainer } from '@kundancool/simple-ui'
import { useToast } from '@kundancool/simple-ui'

const { info } = useToast()
const paid = ref(false)
const lines = [
    { desc: 'Deluxe room × 2 nights', qty: 1, amount: '₹8,400' },
    { desc: 'Airport transfer × 2', qty: 2, amount: '₹2,400' },
    { desc: 'Spa voucher', qty: 1, amount: '₹1,300' },
]

function notify(message) {
    info(message)
}
</script>
