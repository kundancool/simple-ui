<!-- demo: Column alignment — Left, center and right columns in one table. -->
<template>
    <s-data-table :data="rows">
        <s-data-table-column prop="no" label="Left" align="left" />
        <s-data-table-column prop="customer" label="Center" align="center" />
        <s-data-table-column prop="total" label="Right" align="right" />
    </s-data-table>
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
