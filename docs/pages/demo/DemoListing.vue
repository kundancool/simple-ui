<template>
    <div>
        <DemoStage title="Live listing">
        <s-page-header title="Bookings" subtitle="Search, filter and page through reservations." add-text="New booking" refreshable :loading="loading" @refresh="reload" />
        <s-card>
            <s-filter v-model="query" placeholder="Search guest, booking no…" @search="resetPage">
                <s-select v-model="status" :options="statusOptions" option-label="label" option-value="value" placeholder="All statuses" clearable inline class="w-44" />
                <s-date-range-picker v-model="range" :show-presets="false" class="w-64" />
            </s-filter>
            <s-data-table :data="pageRows" :loading="loading" empty-text="No bookings match these filters">
                <s-data-table-column prop="no" label="Booking" width="110px" />
                <s-data-table-column prop="guest" label="Guest" />
                <s-data-table-column prop="ota" label="Channel" width="130px" />
                <s-data-table-column label="Status" width="130px">
                    <template #default="{ row }"><s-tag :type="tagType(row.status)">{{ row.status }}</s-tag></template>
                </s-data-table-column>
                <s-data-table-column prop="total" label="Total" align="right" width="100px" />
                <s-data-table-column label="" width="60px" align="right">
                    <template #default="{ row }">
                        <s-dropdown-menu :items="rowActions(row)" trigger="icon-plain" @select="act($event, row)" />
                    </template>
                </s-data-table-column>
            </s-data-table>
            <div class="mt-3">
                <s-pagination v-model:page="page" v-model:per-page="perPage" :total="filtered.length" @change="sync" />
            </div>
        </s-card>
        <s-toast-container />
        </DemoStage>
        <DemoSource file="DemoListing.vue" />
    </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { SPageHeader } from '@kundancool/simple-ui'
import { SCard } from '@kundancool/simple-ui'
import { SFilter } from '@kundancool/simple-ui'
import { SSelect } from '@kundancool/simple-ui'
import { SDateRangePicker } from '@kundancool/simple-ui'
import { SDataTable } from '@kundancool/simple-ui'
import { SDataTableColumn } from '@kundancool/simple-ui'
import { STag } from '@kundancool/simple-ui'
import { SDropdownMenu } from '@kundancool/simple-ui'
import { SPagination } from '@kundancool/simple-ui'
import { SToastContainer } from '@kundancool/simple-ui'
import { useToast } from '@kundancool/simple-ui'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'

const { info } = useToast()

const guests = ['Aarav Sharma', 'Diya Patel', 'Kabir Singh', 'Meera Iyer', 'Rohan Verma', 'Anaya Rao', 'Vikram Nair', 'Sara Khan', 'Arjun Menon', 'Ishita Bose', 'Aditya Rao', 'Neha Kulkarni']
const otas = ['Direct', 'MMT', 'Booking.com', 'Goibibo']
const statuses = ['CONFIRMED', 'PENDING', 'CANCELLED']

const all = guests.map((guest, i) => ({
    no: `TMZ-${String(101 + i).padStart(3, '0')}`,
    guest,
    ota: otas[i % otas.length],
    status: statuses[i % statuses.length],
    total: `₹${(1800 + i * 430).toLocaleString('en-IN')}`,
}))

const query = ref('')
const status = ref('')
const range = ref([])
const page = ref(1)
const perPage = ref(10)
const loading = ref(false)

const statusOptions = [
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'CANCELLED', label: 'Cancelled' },
]

function tagType(status) {
    return status === 'CONFIRMED' ? 'success' : status === 'PENDING' ? 'warning' : 'danger'
}

const filtered = computed(() => {
    const q = query.value.trim().toLowerCase()
    return all.filter((r) => {
        if (status.value && r.status !== status.value) {
            return false
        }
        if (q && !(r.guest.toLowerCase().includes(q) || r.no.toLowerCase().includes(q))) {
            return false
        }
        return true
    })
})

const pageRows = computed(() => filtered.value.slice((page.value - 1) * perPage.value, page.value * perPage.value))

function resetPage() {
    page.value = 1
}

function sync({ page: p, perPage: pp }) {
    page.value = p
    perPage.value = pp
}

function reload() {
    loading.value = true
    setTimeout(() => {
        loading.value = false
    }, 600)
}

function rowActions(row) {
    return [
        { key: 'view', label: 'View details' },
        { key: 'invoice', label: 'Download invoice' },
        { type: 'separator' },
        { key: 'cancel', label: 'Cancel booking', danger: true },
    ]
}

function act(item, row) {
    info(`${item.label}: ${row.no}`)
}
</script>
