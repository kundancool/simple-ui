<!-- demo: Every density — Small, default and large rows. -->
<template>
    <div class="space-y-4">
        <s-data-table :data="rows" size="small">
            <s-data-table-column prop="no" label="Order" />
            <s-data-table-column prop="total" label="Total" align="right" />
        </s-data-table>
        <s-data-table :data="rows">
            <s-data-table-column prop="no" label="Order" />
            <s-data-table-column prop="total" label="Total" align="right" />
        </s-data-table>
        <s-data-table :data="rows" size="large">
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
