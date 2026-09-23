<!-- demo: Loading, empty and bordered — Skeleton rows, custom empty text, unstriped bordered table. -->
<template>
    <div class="space-y-4">
        <s-data-table :data="rows" :loading="true">
            <s-data-table-column prop="no" label="Order" />
            <s-data-table-column prop="total" label="Total" align="right" />
        </s-data-table>
        <s-data-table :data="[]" empty-text="No orders match these filters">
            <s-data-table-column prop="no" label="Order" />
            <s-data-table-column prop="total" label="Total" align="right" />
        </s-data-table>
        <s-data-table :data="rows" :stripe="false" border>
            <s-data-table-column prop="no" label="Order" />
            <s-data-table-column prop="total" label="Total" align="right" />
        </s-data-table>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { SDataTable } from '@kundancool/simple-ui'
import { SDataTableColumn } from '@kundancool/simple-ui'

const rows = ref([
    { no: 'ORD-001', customer: 'Aarav Sharma', paid: true, total: '₹4,200' },
    { no: 'ORD-002', customer: 'Diya Patel', paid: false, total: '₹2,800' },
])
</script>
