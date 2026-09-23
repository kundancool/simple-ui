<template>
    <div>
        <DemoStage title="Live dashboard">
        <s-page-header class="mb-5" title="Good evening, Kundan" subtitle="Here's what's happening across your workspaces today." />
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <s-stat-card :icon="Wallet" bg-color="s-bg-icon-green" icon-color="s-text-icon-green" value="₹48,210" label="Revenue today" />
            <s-stat-card :icon="CalendarCheck" bg-color="s-bg-icon-blue" icon-color="s-text-icon-blue" value="128" label="New orders" />
            <s-stat-card :icon="Gauge" bg-color="s-bg-icon-purple" icon-color="s-text-icon-purple" value="86%" label="Utilization" />
            <s-stat-card :icon="Hourglass" bg-color="s-bg-icon-yellow" icon-color="s-text-icon-yellow" value="23" label="Pending actions" />
        </div>
        <div class="grid lg:grid-cols-3 gap-3 mt-3">
            <s-card title="Revenue — last 7 days" class="lg:col-span-2">
                <s-line-chart :labels="days" :datasets="revenue" :height="220" />
            </s-card>
            <s-card title="Channel mix">
                <s-doughnut-chart :labels="channels" :datasets="mix" :height="220" />
            </s-card>
        </div>
        <s-card title="Latest orders" class="mt-3">
            <s-data-table :data="rows">
                <s-data-table-column prop="no" label="Order" width="110px" />
                <s-data-table-column prop="customer" label="Customer" />
                <s-data-table-column label="Status">
                    <template #default="{ row }"><s-tag :type="row.status === 'CONFIRMED' ? 'success' : 'warning'">{{ row.status }}</s-tag></template>
                </s-data-table-column>
                <s-data-table-column prop="total" label="Total" align="right" width="100px" />
            </s-data-table>
        </s-card>
        </DemoStage>
        <DemoSource file="DemoDashboard.vue" />
    </div>
</template>
<script setup>
import { Wallet, CalendarCheck, Gauge, Hourglass } from 'lucide-vue-next'
import { SPageHeader } from '@kundancool/simple-ui'
import { SStatCard } from '@kundancool/simple-ui'
import { SCard } from '@kundancool/simple-ui'
import { SLineChart } from '@kundancool/simple-ui'
import { SDoughnutChart } from '@kundancool/simple-ui'
import { SDataTable } from '@kundancool/simple-ui'
import { SDataTableColumn } from '@kundancool/simple-ui'
import { STag } from '@kundancool/simple-ui'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const revenue = [{ label: 'Revenue (₹k)', data: [32, 41, 28, 45, 52, 61, 48], borderColor: '#0c7076', backgroundColor: 'rgba(12,112,118,0.12)', fill: true, tension: 0.4 }]
const channels = ['Direct', 'Marketplace', 'Partner']
const mix = [{ data: [42, 68, 55], backgroundColor: ['#12853d', '#027ab7', '#7c3aed'], borderWidth: 0 }]
const rows = [
    { no: 'ORD-101', customer: 'Aarav Sharma', status: 'CONFIRMED', total: '₹4,200' },
    { no: 'ORD-102', customer: 'Diya Patel', status: 'PENDING', total: '₹2,800' },
    { no: 'ORD-103', customer: 'Kabir Singh', status: 'CONFIRMED', total: '₹6,100' },
    { no: 'ORD-104', customer: 'Meera Iyer', status: 'CONFIRMED', total: '₹3,350' },
]
</script>
