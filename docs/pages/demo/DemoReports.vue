<template>
    <div>
        <DemoStage title="Live utilization report">
            <s-page-header title="September report" subtitle="Generated just now · all workspaces.">
                <s-button size="sm" variant="secondary" @click="notify('XLSX export started (demo).')">Export XLSX</s-button>
                <s-button size="sm" variant="secondary" @click="notify('PDF export started (demo).')">Export PDF</s-button>
            </s-page-header>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <s-stat-card :icon="Gauge" bg-color="s-bg-icon-blue" icon-color="s-text-icon-blue" value="86%" label="Utilization" />
                <s-stat-card :icon="Wallet" bg-color="s-bg-icon-green" icon-color="s-text-icon-green" value="₹4.2L" label="Revenue" />
                <s-stat-card :icon="TrendingUp" bg-color="s-bg-icon-purple" icon-color="s-text-icon-purple" value="+12%" label="vs August" />
                <s-stat-card :icon="Star" bg-color="s-bg-icon-yellow" icon-color="s-text-icon-yellow" value="4.8" label="Rating" />
            </div>
            <div class="grid lg:grid-cols-2 gap-3 mt-3">
                <s-card title="Revenue by channel">
                    <s-bar-chart :labels="['Direct', 'Marketplace', 'Partner', 'Reseller']" :datasets="[{ label: '₹k', data: [120, 210, 180, 60], backgroundColor: '#0c7076', borderRadius: 4 }]" :height="220" />
                </s-card>
                <s-card title="Top categories">
                    <s-data-table :data="items" :stripe="false" size="small">
                        <s-data-table-column prop="type" label="Category" />
                        <s-data-table-column prop="days" label="Days" align="right" width="90px" />
                        <s-data-table-column prop="revenue" label="Revenue" align="right" width="110px" />
                    </s-data-table>
                </s-card>
            </div>
        </DemoStage>
        <DemoSource file="DemoReports.vue" />
        <s-toast-container />
    </div>
</template>

<script setup>
import { Gauge, Wallet, TrendingUp, Star } from 'lucide-vue-next'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SPageHeader } from '@kundancool/simple-ui'
import { SStatCard } from '@kundancool/simple-ui'
import { SCard } from '@kundancool/simple-ui'
import { SBarChart } from '@kundancool/simple-ui'
import { SDataTable } from '@kundancool/simple-ui'
import { SDataTableColumn } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'
import { SToastContainer } from '@kundancool/simple-ui'
import { useToast } from '@kundancool/simple-ui'

const { info } = useToast()
const items = [
    { type: 'Basic', days: 412, revenue: '₹1.9L' },
    { type: 'Standard', days: 188, revenue: '₹1.4L' },
    { type: 'Premium', days: 356, revenue: '₹0.9L' },
]

function notify(message) {
    info(message)
}
</script>
