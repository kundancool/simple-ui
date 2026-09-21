<template>
    <div>
        <DemoStage title="Live analytics">
        <s-page-header title="Analytics" subtitle="Pick a range — every chart follows." />
        <s-card>
            <s-date-range-picker v-model="range" label="Reporting period" @change="shuffle" />
        </s-card>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
            <s-stat-card :icon="Wallet" bg-color="s-bg-icon-green" icon-color="s-text-icon-green" :value="kpiRevenue" label="Revenue" />
            <s-stat-card :icon="CalendarCheck" bg-color="s-bg-icon-blue" icon-color="s-text-icon-blue" :value="kpiBookings" label="Bookings" />
            <s-stat-card :icon="Percent" bg-color="s-bg-icon-purple" icon-color="s-text-icon-purple" :value="kpiOcc" label="Occupancy" />
            <s-stat-card :icon="Star" bg-color="s-bg-icon-yellow" icon-color="s-text-icon-yellow" value="4.8" label="Rating" />
        </div>
        <div class="grid lg:grid-cols-2 gap-3 mt-3">
            <s-card title="Bookings by OTA">
                <s-bar-chart :labels="otas" :datasets="otaData" :height="240" />
            </s-card>
            <s-card title="Revenue trend">
                <s-line-chart :labels="days" :datasets="trend" :height="240" />
            </s-card>
        </div>
        <s-card title="Payment split" class="mt-3">
            <s-doughnut-chart :labels="['Paid', 'Outstanding']" :datasets="split" :height="220" />
        </s-card>
        </DemoStage>
        <DemoSource file="DemoAnalytics.vue" />
    </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { Wallet, CalendarCheck, Percent, Star } from 'lucide-vue-next'
import { SPageHeader } from '@kundancool/simple-ui'
import { SStatCard } from '@kundancool/simple-ui'
import { SCard } from '@kundancool/simple-ui'
import { SDateRangePicker } from '@kundancool/simple-ui'
import { SBarChart } from '@kundancool/simple-ui'
import { SLineChart } from '@kundancool/simple-ui'
import { SDoughnutChart } from '@kundancool/simple-ui'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'

const range = ref([])
const seed = ref(0)

const otas = ['Direct', 'MMT', 'Booking.com', 'Goibibo']
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function varied(base) {
    return base.map((v) => Math.max(1, Math.round(v * (1 + seed.value * 0.07))))
}

const otaData = computed(() => [{ label: 'Bookings', data: varied([42, 68, 55, 21]), backgroundColor: '#0c7076', borderRadius: 4 }])
const trend = computed(() => [{ label: 'Revenue (₹k)', data: varied([32, 41, 28, 45, 52, 61, 48]), borderColor: '#7c3aed', tension: 0.4 }])
const split = computed(() => [{ data: varied([382, 100]), backgroundColor: ['#12853d', '#b45309'], borderWidth: 0 }])
const kpiRevenue = computed(() => `₹${(38 + seed.value * 3).toLocaleString('en-IN')},210`)
const kpiBookings = computed(() => String(128 + seed.value * 9))
const kpiOcc = computed(() => `${Math.min(99, 86 + seed.value)}%`)

function shuffle() {
    seed.value += 1
}
</script>
