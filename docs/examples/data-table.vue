<template>
    <s-data-table :data="rows">
        <s-data-table-column prop="no" label="Order" width="110px" />
        <s-data-table-column prop="customer" label="Customer" />
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
    { no: 'ORD-001', customer: 'Aarav Sharma', paid: true, total: '₹4,200' },
    { no: 'ORD-002', customer: 'Diya Patel', paid: false, total: '₹2,800' },
])
</script>
