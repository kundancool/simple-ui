<template>
    <div v-if="total > 0" class="flex items-center justify-end gap-3 sm:gap-4">
        <div class="flex items-center gap-3 sm:gap-4">
            <p class="text-xs s-text-muted whitespace-nowrap">{{ from }}–{{ to }} of {{ total }}</p>
            <div class="relative">
                <select
                    :value="perPage"
                    aria-label="Results per page"
                    class="s-input h-8 pl-2.5 pr-7 rounded-md text-xs appearance-none cursor-pointer"
                    @change="onPerPageChange($event.target.value)"
                >
                    <option v-for="n in pageSizes" :key="n" :value="n">{{ n }}</option>
                </select>
                <svg class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 s-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
        <div v-if="lastPage > 1" class="flex items-center gap-1">
            <button
                :disabled="page === 1"
                aria-label="Previous page"
                class="s-focus-ring s-page-btn w-8 h-8 flex items-center justify-center rounded-md text-xs font-medium transition-colors"
                :class="page === 1 ? 's-text-muted cursor-not-allowed' : 's-text-secondary'"
                @click="goToPage(page - 1)"
            >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                v-for="p in visiblePages"
                :key="p"
                :aria-label="p === '…' ? undefined : `Page ${p}`"
                :aria-current="p === page ? 'page' : undefined"
                class="s-focus-ring s-page-btn hidden sm:flex w-8 h-8 items-center justify-center rounded-md text-xs font-medium transition-colors"
                :class="p === page ? 's-bg-accent s-text-on-accent' : p === '…' ? 's-text-muted cursor-default' : 's-text-secondary'"
                @click="p !== '…' && goToPage(p)"
            >
                {{ p }}
            </button>
            <span class="sm:hidden text-xs s-text-muted px-2">{{ page }} / {{ lastPage }}</span>
            <button
                :disabled="page === lastPage"
                aria-label="Next page"
                class="s-focus-ring s-page-btn w-8 h-8 flex items-center justify-center rounded-md text-xs font-medium transition-colors"
                :class="page === lastPage ? 's-text-muted cursor-not-allowed' : 's-text-secondary'"
                @click="goToPage(page + 1)"
            >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'SPagination' })

const props = defineProps({
    page: { type: Number, default: 1 },
    perPage: { type: Number, default: 10 },
    total: { type: Number, default: 0 },
    pageSizes: { type: Array, default: () => [10, 20, 50, 100] },
    /** Wires straight into a Laravel-style paginator object. */
    pagination: { type: Object, default: null },
})

const emit = defineEmits(['update:page', 'update:perPage', 'change'])

const page = computed(() => props.pagination?.current_page ?? props.page)
const perPage = computed(() => props.pagination?.per_page ?? props.perPage)
const total = computed(() => props.pagination?.total ?? props.total)
const lastPage = computed(() =>
    props.pagination?.last_page ?? Math.max(1, Math.ceil(total.value / perPage.value)),
)
const from = computed(
    () => props.pagination?.from ?? (total.value === 0 ? 0 : (page.value - 1) * perPage.value + 1),
)
const to = computed(
    () => props.pagination?.to ?? Math.min(page.value * perPage.value, total.value),
)

const visiblePages = computed(() => {
    const totalPages = lastPage.value
    const cur = page.value
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    if (cur <= 4) {
        return [1, 2, 3, 4, 5, '…', totalPages]
    }
    if (cur >= totalPages - 3) {
        return [1, '…', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }
    return [1, '…', cur - 1, cur, cur + 1, '…', totalPages]
})

function goToPage(p) {
    emit('update:page', p)
    emit('change', { page: p, perPage: perPage.value })
}

function onPerPageChange(value) {
    const n = Number(value)
    emit('update:perPage', n)
    emit('change', { page: 1, perPage: n })
}
</script>

<style>
.s-page-btn:not(:disabled):not(.s-bg-accent):hover {
    color: var(--s-text-primary);
    background-color: var(--s-surface-raised);
}
</style>
