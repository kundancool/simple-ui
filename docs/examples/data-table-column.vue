<template>
    <s-data-table :data="rows">
        <s-data-table-column prop="no" label="Order" width="110px" />
        <s-data-table-column prop="customer" label="Customer" />
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
    { no: 'ORD-001', customer: 'Aarav Sharma', total: '₹4,200' },
    { no: 'ORD-002', customer: 'Diya Patel', total: '₹2,800' },
])
</script>
