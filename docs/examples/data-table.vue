<template>
    <s-data-table :data="rows">
        <s-data-table-column prop="no" label="Booking" width="110px" />
        <s-data-table-column prop="guest" label="Guest" />
        <s-data-table-column label="Status">
            <template #default="{ row }">
                <s-tag :type="row.paid ? 'success' : 'warning'">{{ row.paid ? 'Paid' : 'Due' }}</s-tag>
            </template>
        </s-data-table-column>
        <s-data-table-column prop="total" label="Total" align="right" width="100px" />
    </s-data-table>
</template>

<script setup>
import { ref } from 'vue'
import { SDataTable } from '@kundancool/simple-ui'
import { SDataTableColumn } from '@kundancool/simple-ui'
import { STag } from '@kundancool/simple-ui'

const rows = ref([
    { no: 'TMZ-001', guest: 'Aarav Sharma', paid: true, total: '₹4,200' },
    { no: 'TMZ-002', guest: 'Diya Patel', paid: false, total: '₹2,800' },
])
</script>
