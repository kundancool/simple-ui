<template>
    <s-data-table :data="rows">
        <s-data-table-column prop="no" label="Booking" width="110px" />
        <s-data-table-column prop="guest" label="Guest" />
        <s-data-table-column label="Total" align="right" width="100px">
            <template #default="{ row }"><span class="font-semibold">{{ row.total }}</span></template>
        </s-data-table-column>
    </s-data-table>
</template>

<script setup>
import { ref } from 'vue'
import { SDataTable } from '@kundancool/simple-ui'
import { SDataTableColumn } from '@kundancool/simple-ui'

const rows = ref([
    { no: 'TMZ-001', guest: 'Aarav Sharma', total: '₹4,200' },
    { no: 'TMZ-002', guest: 'Diya Patel', total: '₹2,800' },
])
</script>
