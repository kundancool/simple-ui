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
                        class="fixed s-bg-surface border s-border-theme rounded-lg s-shadow-lg-theme p-3 origin-top w-max max-w-[calc(100vw-1rem)] max-h-[calc(100vh-1rem)] overflow-y-auto"
                        :style="{ ...panelStyle, zIndex: 'var(--s-z-dropdown)' }"
                        @keydown.escape="closePanel"
                    >
                        <div class="flex flex-col min-[540px]:flex-row gap-3">
                            <div v-if="usableOptions.length" role="group" aria-label="Date options" class="hidden min-[540px]:flex min-[540px]:flex-col gap-1.5 flex-shrink-0 min-[540px]:w-36 min-[540px]:border-r s-border-theme min-[540px]:pr-3">
                                <button
                                    v-for="p in usableOptions"
                                    :key="p.label"
                                    type="button"
                                    class="s-focus-ring px-2.5 py-1.5 text-xs rounded-md flex items-center justify-start min-[540px]:w-full text-left"
                                    :class="activeOption === p.label ? 's-bg-accent-subtle s-text-accent' : 's-bg-surface-raised s-text-secondary s-preset-hover'"
                                    :aria-pressed="activeOption === p.label"
                                    @click="applyOption(p)"
                                >{{ p.label }}</button>
                            </div>
                            <div class="min-w-0 flex-1">
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
                            <div v-for="(month, mi) in months" :key="mi" :class="['s-cal-month', mi > 0 && 'hidden min-[540px]:block']">
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
                            </div>
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
import { formatWithTokens, isInDisabledRanges, normalizeOption, parseWithTokens, resolveOptions } from '../../utils/dateOptions'
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
    /** Shortcut override: [{ label, value } | { label, range: [from, to] }] as YYYY-MM-DD. No options unless defined. */
    options: { type: Array, default: null },
    /** Deprecated alias of `options`. Kept so existing `presets` usage keeps working. */
    presets: { type: Array, default: undefined },
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
    /** Display format for the trigger text. Supports YYYY, MM, DD tokens. */
    format: { type: String, default: 'YYYY-MM-DD' },
    /** Emitted value format (same tokens). Display stays on `format`. */
    valueFormat: { type: String, default: 'YYYY-MM-DD' },
    /** Disable rule: (date: Date) => true disables that day. */
    disabledDate: { type: Function, default: null },
    /** Disable rule: [[from, to]] as YYYY-MM-DD disables those ranges. */
    disabledRanges: { type: Array, default: () => [] },
    /**
     * Visible month columns. Defaults to 2 in range mode, 1 otherwise —
     * the dashboard-style two-up calendar. Stacks vertically on narrow screens.
     */
    columns: { type: Number, default: null },
})

const emit = defineEmits(['update:modelValue', 'change'])

const errorMessage = computed(() => firstValidationError(props.error))
const activeOption = ref('')
const usableOptions = computed(() => resolveOptions(props.options ?? props.presets ?? [], props.range))

/** Shared height scale so triggers line up with inputs and selects. */
const fieldSize = useFieldSize(computed(() => props.size))
const SIZE_CLASS = {
    xs: 'px-2 text-xs',
    sm: 'px-2.5 text-xs',
    md: 'px-3 text-sm',
    lg: 'px-3.5 text-base',
    xl: 'px-4 text-base',
    '2xl': 'px-5 text-lg',
    '3xl': 'px-6 text-xl',
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

function parseValue(value) {
    return parseWithTokens(value, props.valueFormat) ?? parseDate(value)
}

/** Model values (in `valueFormat`) back to canonical ISO for compares. */
function toIso(value) {
    const d = parseValue(value)
    return d ? formatDate(d) : ''
}

function formatDisplay(value) {
    const d = parseValue(value)
    if (!d) {
        return ''
    }
    return formatWithTokens(d, props.format)
}

/** Convert internal ISO to the emitted `valueFormat`. */
function toValue(iso) {
    const d = parseDate(iso)
    return d ? formatWithTokens(d, props.valueFormat) : iso
}

function currentValue() {
    return props.range ? toIso(props.modelValue?.[0] ?? '') : toIso(props.modelValue)
}

/** Model values back to canonical ISO for internal compares.
 * Range mode with a non-array model ('' default, stray string) is an empty
 * range — never a crash. */
const isoRange = computed(() => {
    if (!props.range) {
        return []
    }
    const raw = Array.isArray(props.modelValue) ? props.modelValue : []
    return raw.map((v) => toIso(v))
})

const displayText = computed(() => {
    if (props.range) {
        const raw = Array.isArray(props.modelValue) ? props.modelValue : []
        const [from, to] = raw
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

/** Mirrors the min-[540px] breakpoint CSS uses: below it only the first
 * month shows, so the heading must name one month, not the range. */
const wideScreen = ref(typeof window !== 'undefined' && !!window.matchMedia?.('(min-width: 540px)').matches)
function syncViewport() {
    wideScreen.value = !!window.matchMedia?.('(min-width: 540px)').matches
}

const visibleColumns = computed(() => (wideScreen.value ? resolvedColumns.value : 1))

const visibleRangeLabel = computed(() => {
    const first = monthStart(0)
    const firstLabel = first.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    if (visibleColumns.value < 2) {
        return firstLabel
    }
    const last = monthStart(visibleColumns.value - 1)
    if (last.getFullYear() === first.getFullYear()) {
        const lastMonth = last.toLocaleDateString(undefined, { month: 'long' })
        const firstMonth = first.toLocaleDateString(undefined, { month: 'long' })
        return `${firstMonth} – ${lastMonth} ${last.getFullYear()}`
    }
    return `${firstLabel} – ${last.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}`
})

function isDisabledDay(d) {
    if (props.min && d < startOfDay(parseDate(props.min))) {
        return true
    }
    if (props.max && d > startOfDay(parseDate(props.max))) {
        return true
    }
    if (typeof props.disabledDate === 'function' && props.disabledDate(new Date(d))) {
        return true
    }
    return isInDisabledRanges(formatDate(d), props.disabledRanges)
}

function isSelected(d) {
    const iso = formatDate(d)
    if (props.range) {
        const [from, to] = isoRange.value
        if (from && to) {
            return iso >= from && iso <= to
        }
        return iso === from
    }
    return iso === toIso(props.modelValue)
}

function isEndpoint(d) {
    const iso = formatDate(d)
    if (props.range) {
        const [from, to] = isoRange.value
        return iso === from || iso === to
    }
    return iso === toIso(props.modelValue)
}

/** Ghost range between the picked start and the hovered day. */
function inHoverRange(d) {
    if (!props.range) {
        return false
    }
    const [from, to] = isoRange.value
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
        const disabled = otherMonth || isDisabledDay(date)
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
            cells: monthCells(start.getFullYear(), start.getMonth()),
        }
    }),
)

function shiftMonth(delta) {
    anchor.value = new Date(anchor.value.getFullYear(), anchor.value.getMonth() + delta, 1)
}

function commit(value) {
    activeOption.value = ''
    emit('update:modelValue', value)
    emit('change', value)
}

function pick(date) {
    if (isDisabledDay(date)) {
        return
    }
    const iso = formatDate(date)
    if (!props.range) {
        commit(toValue(iso))
        open.value = false
        return
    }
    const [from, to] = isoRange.value
    if (!from || (from && to)) {
        commit([toValue(iso), ''])
    } else if (iso < from) {
        commit([toValue(iso), toValue(from)])
        open.value = false
    } else {
        commit([toValue(from), toValue(iso)])
        open.value = false
    }
}

function applyOption(p) {
    const value = normalizeOption(p, props.range)
    if (value === null) {
        return
    }
    activeOption.value = p.label
    const out = Array.isArray(value) ? [toValue(value[0]), toValue(value[1])] : toValue(value)
    emit('update:modelValue', out)
    emit('change', out)
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

/** Gap between the trigger and the panel, and the viewport margin. */
const PANEL_GAP = 4
const VIEW_MARGIN = 8

/**
 * Keep the whole calendar in view: measure it, then pick the side with
 * room — below by default, above when cramped; left-aligned by default,
 * right-aligned near the right edge. The panel never compresses (w-max)
 * and never leaves the viewport on any side.
 */
function updatePanelPosition() {
    if (!triggerRef.value) {
        return
    }
    const rect = triggerRef.value.getBoundingClientRect()
    const width = panelRef.value?.offsetWidth ?? 0
    const height = panelRef.value?.offsetHeight ?? 0
    const viewWidth = window.innerWidth
    const viewHeight = window.innerHeight

    let left = rect.left
    if (width > 0 && left + width > viewWidth - VIEW_MARGIN) {
        left = rect.right - width
    }
    left = Math.max(VIEW_MARGIN, Math.min(left, viewWidth - VIEW_MARGIN))

    let top = rect.bottom + PANEL_GAP
    if (height > 0 && top + height > viewHeight - VIEW_MARGIN) {
        top = rect.top - height - PANEL_GAP
    }
    top = Math.max(VIEW_MARGIN, top)

    panelStyle.value = { top: `${top}px`, left: `${left}px` }
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
    window.matchMedia?.('(min-width: 540px)').addEventListener?.('change', syncViewport)
})
onBeforeUnmount(() => {
    document.removeEventListener('mousedown', onClickOutside)
    window.removeEventListener('scroll', onScrollResize, true)
    window.removeEventListener('resize', onScrollResize)
    window.matchMedia?.('(min-width: 540px)').removeEventListener?.('change', syncViewport)
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
