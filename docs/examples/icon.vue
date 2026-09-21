<template>
    <div class="flex flex-wrap items-center gap-3">
        <s-icon name="refresh" />
        <s-icon name="refreshright" />
        <s-icon name="plus" />
        <s-icon name="edit" />
        <s-icon name="download" />
        <s-icon name="delete" />
        <s-icon name="loading" spinning label="Loading" />
    </div>
    <s-input v-model="query" placeholder="Filter icons…" class="mt-4" />
    <div class="mt-2 grid grid-cols-3 sm:grid-cols-5 gap-1.5 max-h-72 overflow-y-auto">
        <span
            v-for="name in filtered"
            :key="name"
            class="flex items-center gap-2 px-2 py-1.5 rounded-md border s-border-theme s-bg-surface text-[11px] s-text-secondary"
        >
            <s-icon :name="name" size="sm" />
            <span class="truncate font-mono">{{ name }}</span>
        </span>
    </div>
    <p class="text-xs s-text-muted mt-2">{{ filtered.length }} of {{ names.length }} icons</p>
</template>

<script setup>
import { ref, computed } from 'vue'
import { SIcon } from '@kundancool/simple-ui'
import { SInput } from '@kundancool/simple-ui'
import { iconNames } from '@kundancool/simple-ui'
const names = iconNames
const query = ref('')
const filtered = computed(() => {
    const q = query.value.trim().toLowerCase()
    return q ? names.filter((n) => n.includes(q)) : names
})
</script>
