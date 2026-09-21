<template>
    <!-- intentionally empty — SDataTable renders via vnode introspection -->
    <slot />
</template>

<script setup>
/**
 * Declarative column for SDataTable (mirrors el-table-column).
 * Renders nothing; SDataTable reads props + slot fns from the vnode.
 */
defineOptions({ name: 'SDataTableColumn', inheritAttrs: false })

defineProps({
    /** Data key, dot-notation supported: "country.name". */
    prop: { type: String, default: null },
    label: { type: String, default: '' },
    width: { type: String, default: null },
    minWidth: { type: String, default: null },
    align: { type: String, default: 'left', validator: (v) => ['left', 'center', 'right'].includes(v) },
    /** Header alignment — defaults to align. */
    headerAlign: { type: String, default: null, validator: (v) => v === null || ['left', 'center', 'right'].includes(v) },
})
</script>
