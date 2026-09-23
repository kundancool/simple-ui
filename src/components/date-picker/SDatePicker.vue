<template>
    <div ref="wrapperRef">
        <label v-if="label" :for="fieldId" class="block text-sm font-medium s-text-primary mb-1.5">
            {{ label }}
            <span v-if="required" class="s-text-accent" aria-hidden="true">*</span>
        </label>
        <div class="relative">
            <input
                :id="fieldId"
                ref="triggerRef"
                type="text"
                readonly
                :name="name || undefined"
                :value="displayText"
                :placeholder="placeholder"
                :disabled="disabled"
                :aria-invalid="errorMessage ? 'true' : undefined"
                :aria-describedby="describedBy"
                aria-haspopup="dialog"
                :aria-expanded="open"
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
                inputmode="none"
                :class="['s-input w-full rounded-md pr-9 cursor-pointer', SIZE_CLASS[fieldSize], errorMessage ? 's-is-error' : '', disabled ? 'opacity-50 cursor-not-allowed' : '']"
                :style="controlStyle"
                @click="toggleOpen"
                @keydown="onTriggerKeydown"
            />
            <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3" aria-hidden="true">
                <svg class="w-4 h-4 s-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </span>
            <Teleport to="body">
                <Transition name="s-pop">
                    <div
                        v-if="open"
                        ref="panelRef"
                        data-overlay
                        role="dialog"
                        aria-label="Choose date"
                        class="fixed s-bg-surface border s-border-theme rounded-lg s-shadow-lg-theme p-3 origin-top"
                        :style="{ ...panelStyle, zIndex: 'var(--s-z-dropdown)' }"
                        @keydown.escape="closePanel"
                    >
                        <div class="flex items-center justify-between mb-2">
                            <button type="button" aria-label="Previous month" class="s-focus-ring s-cal-nav w-7 h-7 flex items-center justify-center rounded-md s-text-secondary" @click="shiftMonth(-1)">
                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <span class="text-sm font-semibold s-text-primary">{{ visibleRangeLabel }}</span>
                            <button type="button" aria-label="Next month" class="s-focus-ring s-cal-nav w-7 h-7 flex items-center justify-center rounded-md s-text-secondary" @click="shiftMonth(1)">
                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                        <div class="flex flex-col min-[540px]:flex-row gap-4">
                            <div v-for="(month, mi) in months" :key="mi" class="s-cal-month">
                                <p class="text-xs font-semibold s-text-secondary text-center mb-1">{{ month.label }}</p>
                                <div class="grid grid-cols-7 gap-0.5 text-center text-[11px] font-medium s-text-muted mb-1">
                                    <span v-for="d in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="d">{{ d }}</span>
                                </div>
                                <div class="grid grid-cols-7 gap-0.5">
                                    <button
                                        v-for="cell in month.cells"
                                        :key="cell.key"
                                        type="button"
                                        :disabled="cell.disabled"
                                        class="s-focus-ring w-8 h-8 text-xs rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                        :class="cell.class"
                                        @click="pick(cell.date)"
                                        @mouseenter="range ? (hoverDate = cell.date) : null"
                                    >{{ cell.day }}</button>
                                </div>
                            </div>
                        </div>
                        <div v-if="usablePresets.length" class="flex flex-wrap gap-1.5 mt-2 pt-2 border-t s-border-theme" role="group" aria-label="Date presets">
                            <button
                                v-for="p in usablePresets"
                                :key="p.label"
                                type="button"
                                class="s-focus-ring px-2 py-1 text-xs rounded-md"
                                :class="activePreset === p.label ? 's-bg-accent-subtle s-text-accent' : 's-bg-surface-raised s-text-secondary s-preset-hover'"
                                :aria-pressed="activePreset === p.label"
                                @click="applyPreset(p)"
                            >{{ p.label }}</button>
                        </div>
                    </div>
                </Transition>
            </Teleport>
        </div>
        <p v-if="errorMessage" :id="messageId" class="mt-1 text-xs s-text-danger" role="alert">{{ errorMessage }}</p>
        <p v-else-if="hint" :id="messageId" class="mt-1 text-xs s-text-muted">{{ hint }}</p>
    </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount, useId, watch } from 'vue'
import { firstValidationError } from '../../utils/validation'
import { FIELD_HEIGHTS, isFieldSize } from '../../utils/fieldSize'
import { normalizePreset, resolvePresets } from '../../utils/datePresets'
import { useFieldSize } from '../../composables/formContext'

defineOptions({ name: 'SDatePicker' })

const props = defineProps({
    /** 'YYYY-MM-DD' string, or [from, to] in range mode. */
    modelValue: { type: [String, Array], default: '' },
    label: { type: String, default: '' },
    placeholder: { type: String, default: 'Select date' },
    /** Range mode: v-model is [from, to]. */
    range: { type: Boolean, default: false },
    min: { type: String, default: '' },
    max: { type: String, default: '' },
    /** [{ label, value } | { label, range: [from, to] }] */
    presets: { type: Array, default: () => [] },
    error: { type: [String, Array], default: '' },
    hint: { type: String, default: '' },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    /** xs | sm | md | lg — inherits from the enclosing s-form-item when omitted. */
    size: { type: String, default: undefined, validator: isFieldSize },
    /** Native input name so the date joins form submission. */
    name: { type: String, default: '' },
    /** Deprecated no-op (roots are margin-free per the layout-neutrality rule). Kept so existing `inline` usage keeps working. */
    inline: { type: Boolean, default: false },
    /** Output format for the trigger text. Supports YYYY, MM, DD tokens. */
    format: { type: String, default: 'YYYY-MM-DD' },
    /**
     * Visible month columns. Defaults to 2 in range mode, 1 otherwise —
     * the dashboard-style two-up calendar. Stacks vertically on narrow screens.
     */
    columns: { type: Number, default: null },
})

const emit = defineEmits(['update:modelValue', 'change'])

const errorMessage = computed(() => firstValidationError(props.error))
const activePreset = ref('')
const usablePresets = computed(() => resolvePresets(props.presets, props.range))

/** Shared height scale so triggers line up with inputs and selects. */
const fieldSize = useFieldSize(computed(() => props.size))
const SIZE_CLASS = {
    xs: 'px-2 text-xs',
    sm: 'px-2.5 text-xs',
    md: 'px-3 text-sm',
    lg: 'px-3.5 text-base',
}
const controlStyle = computed(() => ({ '--s-field-h': FIELD_HEIGHTS[fieldSize.value] }))
const fieldId = useId()
const messageId = `${fieldId}-message`
const describedBy = computed(() => (errorMessage.value || props.hint ? messageId : undefined))

const open = ref(false)
const wrapperRef = ref(null)
const triggerRef = ref(null)
const panelRef = ref(null)
const panelStyle = ref({})
const hoverDate = ref(null)

const today = startOfDay(new Date())
const anchor = ref(startOfDay(parseDate(currentValue()) ?? new Date()))

function startOfDay(d) {
    const c = new Date(d)
    c.setHours(0, 0, 0, 0)
    return c
}

function parseDate(value) {
    if (!value) {
        return null
    }
    const d = new Date(`${value}T00:00:00`)
    return Number.isNaN(d.getTime()) ? null : startOfDay(d)
}

function formatDate(d) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
}

function formatDisplay(value) {
    const d = parseDate(value)
    if (!d) {
        return ''
    }
    return props.format
        .replace('YYYY', String(d.getFullYear()))
        .replace('MM', String(d.getMonth() + 1).padStart(2, '0'))
        .replace('DD', String(d.getDate()).padStart(2, '0'))
}

function currentValue() {
    return props.range ? (props.modelValue?.[0] ?? '') : props.modelValue
}

const displayText = computed(() => {
    if (props.range) {
        const [from, to] = props.modelValue ?? []
        if (!from) {
            return ''
        }
        return to ? `${formatDisplay(from)} → ${formatDisplay(to)}` : `${formatDisplay(from)} → …`
    }
    return formatDisplay(props.modelValue)
})

const resolvedColumns = computed(() => props.columns ?? (props.range ? 2 : 1))

function monthStart(offset) {
    return new Date(anchor.value.getFullYear(), anchor.value.getMonth() + offset, 1)
}

const visibleRangeLabel = computed(() => {
    const first = monthStart(0).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    if (resolvedColumns.value < 2) {
        return first
    }
    const last = monthStart(resolvedColumns.value - 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    return `${first} – ${last}`
})

function inBounds(d) {
    if (props.min && d < startOfDay(parseDate(props.min))) {
        return false
    }
    if (props.max && d > startOfDay(parseDate(props.max))) {
        return false
    }
    return true
}

function isSelected(d) {
    const iso = formatDate(d)
    if (props.range) {
        const [from, to] = props.modelValue ?? []
        if (from && to) {
            return iso >= from && iso <= to
        }
        return iso === from
    }
    return iso === props.modelValue
}

function isEndpoint(d) {
    const iso = formatDate(d)
    if (props.range) {
        const [from, to] = props.modelValue ?? []
        return iso === from || iso === to
    }
    return iso === props.modelValue
}

/** Ghost range between the picked start and the hovered day. */
function inHoverRange(d) {
    if (!props.range) {
        return false
    }
    const [from, to] = props.modelValue ?? []
    if (!from || to || !hoverDate.value) {
        return false
    }
    const hov = formatDate(startOfDay(new Date(hoverDate.value)))
    const iso = formatDate(d)
    const lo = from < hov ? from : hov
    const hi = from < hov ? hov : from
    return iso > lo && iso < hi
}

function monthCells(year, month) {
    const first = new Date(year, month, 1)
    const start = new Date(first)
    start.setDate(start.getDate() - first.getDay())
    return Array.from({ length: 42 }, (_, i) => {
        const date = new Date(start)
        date.setDate(start.getDate() + i)
        const otherMonth = date.getMonth() !== month
        const disabled = otherMonth || !inBounds(date)
        return {
            key: formatDate(date),
            date,
            day: date.getDate(),
            disabled,
            class: [
                isEndpoint(date) ? 's-bg-accent s-text-on-accent font-semibold' : '',
                !isEndpoint(date) && (isSelected(date) || inHoverRange(date)) ? 's-bg-accent-subtle s-text-accent' : '',
                !isSelected(date) && !inHoverRange(date) && !disabled ? 's-text-primary s-cell-hover' : '',
                formatDate(date) === formatDate(today) && !isSelected(date) ? 's-cell-today' : '',
                otherMonth ? 'opacity-0 pointer-events-none' : '',
            ].join(' '),
        }
    })
}

const months = computed(() =>
    Array.from({ length: resolvedColumns.value }, (_, offset) => {
        const start = monthStart(offset)
        return {
            label: start.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
            cells: monthCells(start.getFullYear(), start.getMonth()),
        }
    }),
)

function shiftMonth(delta) {
    anchor.value = new Date(anchor.value.getFullYear(), anchor.value.getMonth() + delta, 1)
}

function commit(value) {
    activePreset.value = ''
    emit('update:modelValue', value)
    emit('change', value)
}

function pick(date) {
    if (!inBounds(date)) {
        return
    }
    const iso = formatDate(date)
    if (!props.range) {
        commit(iso)
        open.value = false
        return
    }
    const [from, to] = props.modelValue ?? []
    if (!from || (from && to)) {
        commit([iso, ''])
    } else if (iso < from) {
        commit([iso, from])
        open.value = false
    } else {
        commit([from, iso])
        open.value = false
    }
}

function applyPreset(p) {
    const value = normalizePreset(p, props.range)
    if (value === null) {
        return
    }
    activePreset.value = p.label
    emit('update:modelValue', Array.isArray(value) ? [value[0], value[1]] : value)
    emit('change', Array.isArray(value) ? [value[0], value[1]] : value)
    open.value = false
}

/** Close from inside the calendar and hand focus back to the field. */
function closePanel() {
    open.value = false
    triggerRef.value?.focus()
}

/** Keyboard parity with the old button trigger: Enter/Space/Down open, Escape closes. */
function onTriggerKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
        event.preventDefault()
        if (!open.value) {
            toggleOpen()
        }
    } else if (event.key === 'Escape' && open.value) {
        closePanel()
    }
}

function toggleOpen() {
    if (props.disabled) {
        return
    }
    open.value = !open.value
    if (open.value) {
        anchor.value = startOfDay(parseDate(currentValue()) ?? new Date())
        nextTick(updatePanelPosition)
    }
}

function updatePanelPosition() {
    if (!triggerRef.value) {
        return
    }
    const rect = triggerRef.value.getBoundingClientRect()
    panelStyle.value = { top: `${rect.bottom + 4}px`, left: `${rect.left}px` }
}

function onClickOutside(e) {
    if (wrapperRef.value && !wrapperRef.value.contains(e.target) && (!panelRef.value || !panelRef.value.contains(e.target))) {
        open.value = false
    }
}

function onScrollResize() {
    if (open.value) {
        updatePanelPosition()
    }
}

watch(
    () => props.modelValue,
    () => {
        hoverDate.value = null
    },
)

onMounted(() => {
    document.addEventListener('mousedown', onClickOutside)
    window.addEventListener('scroll', onScrollResize, true)
    window.addEventListener('resize', onScrollResize)
})
onBeforeUnmount(() => {
    document.removeEventListener('mousedown', onClickOutside)
    window.removeEventListener('scroll', onScrollResize, true)
    window.removeEventListener('resize', onScrollResize)
})
</script>

<style>
.s-cell-hover:hover {
    background-color: var(--s-surface-raised);
}
.s-cell-today {
    box-shadow: inset 0 0 0 1px var(--s-accent-border);
}
.s-cal-nav:hover {
    background-color: var(--s-surface-raised);
    color: var(--s-text-primary);
}
.s-preset-hover:hover {
    color: var(--s-text-primary);
    background-color: var(--s-accent-subtle);
}
</style>
