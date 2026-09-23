<template>
    <div>
        <DemoStage title="Live orders">
            <s-page-header class="mb-5" title="Orders" subtitle="Fulfilment queue for this week." />
            <s-card>
                <s-filter class="mb-4" v-model="query" placeholder="Search order, customer…" @search="noop">
                    <s-select v-model="status" :options="statusOptions" option-label="label" option-value="value" placeholder="All statuses" clearable class="w-44" />
                </s-filter>
                <s-data-table :data="filtered" empty-text="No orders match">
                    <s-data-table-column prop="id" label="Order" width="100px" />
                    <s-data-table-column prop="customer" label="Customer" />
                    <s-data-table-column prop="items" label="Items" width="80px" align="center" />
                    <s-data-table-column label="Payment" width="130px">
                        <template #default="{ row }"><s-tag :type="row.paid ? 'success' : 'warning'" size="sm">{{ row.paid ? 'Paid' : 'Unpaid' }}</s-tag></template>
                    </s-data-table-column>
                    <s-data-table-column label="Status" width="150px">
                        <template #default="{ row }">
                            <s-select v-model="row.stage" :options="stages" option-label="label" option-value="value" inline @change="moved(row)" />
                        </template>
                    </s-data-table-column>
                    <s-data-table-column prop="total" label="Total" align="right" width="100px" />
                </s-data-table>
            </s-card>
        </DemoStage>
        <DemoSource file="DemoOrders.vue" />
        <s-toast-container />
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
import { SToastContainer } from '@kundancool/simple-ui'
import { useToast } from '@kundancool/simple-ui'

const { info } = useToast()
const stages = [
    { value: 'New', label: 'New' },
    { value: 'Packed', label: 'Packed' },
    { value: 'Shipped', label: 'Shipped' },
    { value: 'Delivered', label: 'Delivered' },
]
const statusOptions = [{ value: '', label: 'All statuses' }, ...stages]

const orders = ref([
    { id: '#9041', customer: 'Aarav Sharma', items: 3, paid: true, stage: 'Packed', total: '₹4,200' },
    { id: '#9042', customer: 'Diya Patel', items: 1, paid: false, stage: 'New', total: '₹1,150' },
    { id: '#9043', customer: 'Kabir Singh', items: 5, paid: true, stage: 'Shipped', total: '₹8,900' },
    { id: '#9044', customer: 'Meera Iyer', items: 2, paid: true, stage: 'Delivered', total: '₹2,340' },
])

const query = ref('')
const status = ref('')

const filtered = computed(() => {
    const q = query.value.trim().toLowerCase()
    return orders.value.filter((o) => {
        if (status.value && o.stage !== status.value) {
            return false
        }
        return !q || o.customer.toLowerCase().includes(q) || o.id.toLowerCase().includes(q)
    })
})

function moved(row) {
    info(`${row.id} moved to ${row.stage}.`)
}

function noop() {}
</script>
