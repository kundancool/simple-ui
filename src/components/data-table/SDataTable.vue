<template>
    <div v-if="loading" class="space-y-3" aria-busy="true">
        <SSkeleton v-for="i in rows" :key="i" height="12" rounded="lg" aria-label="Loading rows" />
    </div>
    <div v-else-if="data.length === 0" class="flex flex-col items-center justify-center py-12">
        <slot name="empty">
            <p class="text-sm s-text-muted">{{ emptyText }}</p>
        </slot>
    </div>
    <div v-else class="s-data-table" :class="['overflow-x-auto', border ? 'border s-border-theme rounded-lg' : '']">
        <table class="w-full text-sm s-text-primary" :class="border ? borderCellClass : ''">
            <caption v-if="caption" class="sr-only">{{ caption }}</caption>
            <thead>
                <tr class="border-b s-border-theme">
                    <th
                        v-for="(col, i) in columnVnodes"
                        :key="i"
                        scope="col"
                        :style="{ width: col.props?.width, minWidth: col.props?.minWidth }"
                        :class="[padding, 'text-xs font-medium uppercase tracking-wider s-text-muted', alignClass(col.props?.headerAlign || col.props?.align), col.props?.class]"
                    >
                        <HeaderContent :col="col" />
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, rowIndex) in data" :key="rowKey(row, rowIndex)" :class="getRowClass(row, rowIndex)">
                    <td
                        v-for="(col, colIndex) in columnVnodes"
                        :key="colIndex"
                        :style="{ width: col.props?.width, minWidth: col.props?.minWidth }"
                        :class="[padding, alignClass(col.props?.align), col.props?.class]"
                    >
                        <CellContent :col="col" :row="row" :index="rowIndex" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { useSlots, computed, h, defineComponent, Fragment } from 'vue'
import SDataTableColumn from '../data-table-column/SDataTableColumn.vue'
import SSkeleton from '../skeleton/SSkeleton.vue'

defineOptions({ name: 'SDataTable' })

const props = defineProps({
    data: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    rows: { type: Number, default: 5 },
    emptyText: { type: String, default: 'No data available' },
    size: { type: String, default: 'default', validator: (v) => ['small', 'default', 'large'].includes(v) },
    stripe: { type: Boolean, default: true },
    border: { type: Boolean, default: false },
    rowClassName: { type: [String, Function], default: '' },
    /** Screen-reader table caption. */
    caption: { type: String, default: '' },
    /** Key per row for :key — string path or (row, index) fn. Defaults to index. */
    rowKey: { type: [String, Function], default: null },
})

const slots = useSlots()

const borderCellClass = '[&_td+td]:border-l [&_th+th]:border-l s-data-table-bordered'

function flattenVnodes(vnodes) {
    return vnodes.flatMap((vnode) => (vnode.type === Fragment ? flattenVnodes(vnode.children ?? []) : [vnode]))
}

function alignClass(align) {
    return align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'
}

const columnVnodes = computed(() => {
    const defaultSlot = slots.default?.() ?? []
    return flattenVnodes(defaultSlot).filter((vnode) => vnode.type === SDataTableColumn)
})

const padding = computed(
    () => ({ small: 'px-3 py-2', default: 'px-4 py-3', large: 'px-5 py-4' })[props.size],
)

function resolveValue(row, prop) {
    if (!prop) {
        return ''
    }
    return prop.split('.').reduce((acc, key) => acc?.[key], row) ?? ''
}

function rowKey(row, index) {
    if (typeof props.rowKey === 'function') {
        return props.rowKey(row, index)
    }
    if (typeof props.rowKey === 'string') {
        return resolveValue(row, props.rowKey) || index
    }
    return index
}

function getRowClass(row, index) {
    const extra = typeof props.rowClassName === 'function' ? props.rowClassName(row, index) : props.rowClassName
    const stripeClass = props.stripe && index % 2 === 1 ? 's-bg-surface-raised' : 's-bg-surface'
    return ['group border-b s-border-theme last:border-0 s-row-hover transition-colors', stripeClass, extra]
        .filter(Boolean)
        .join(' ')
}

const CellContent = defineComponent({
    props: ['col', 'row', 'index'],
    setup(p) {
        return () => {
            const slot = p.col.children?.default
            if (slot) {
                return slot({ row: p.row, $index: p.index })
            }
            const prop = p.col.props?.prop
            return prop ? h('span', { class: 's-text-secondary' }, String(resolveValue(p.row, prop))) : null
        }
    },
})

const HeaderContent = defineComponent({
    props: ['col'],
    setup(p) {
        return () => {
            const slot = p.col.children?.header
            if (slot) {
                return slot({ column: p.col.props })
            }
            return h('span', p.col.props?.label ?? '')
        }
    },
})
</script>

<style>
.s-data-table-bordered td + td,
.s-data-table-bordered th + th {
    border-color: var(--s-border);
}
.s-data-table tbody tr.s-row-hover:hover {
    background-color: var(--s-surface-raised);
}
</style>
