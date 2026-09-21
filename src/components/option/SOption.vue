<template>
    <!-- intentionally empty — SSelect reads props from the vnode -->
    <slot />
</template>

<script setup>
/**
 * Declarative option for SSelect, so options can be authored in markup:
 *
 *     <s-select v-model="channel">
 *       <s-option label="Direct" value="direct" />
 *       <s-option label="Marketplace" value="marketplace" disabled />
 *     </s-select>
 *
 * Renders nothing itself; SSelect reads these through vnode introspection,
 * exactly like SDataTableColumn does for tables.
 */
defineOptions({ name: 'SOption', inheritAttrs: false })

defineProps({
    label: { type: String, default: '' },
    value: { type: [String, Number, Boolean], default: null },
    disabled: { type: Boolean, default: false },
})
</script>
