<template>
    <div :class="[rootClass]" :style="rootStyle" ref="wrapperRef">
        <label v-if="label" :for="fieldId" class="block text-sm font-medium s-text-primary mb-1.5">
            {{ label }}
            <span v-if="required" class="s-text-accent" aria-hidden="true">*</span>
        </label>

        <!-- Native select (default when filterable is false) -->
        <div v-if="!filterable" class="relative">
            <select
                :id="fieldId"
                :value="modelValue"
                :disabled="isDisabled"
                :aria-label="label || placeholder"
                :aria-invalid="errorMessage ? 'true' : undefined"
                :aria-describedby="describedBy"
                :class="['s-input w-full appearance-none rounded-md', sizeClass, errorMessage ? 's-is-error' : '']"
                :style="controlStyle"
                v-bind="fieldAttrs"
                @change="onNativeChange"
            >
                <option value="" disabled>{{ placeholder }}</option>
                <option v-for="option in resolvedOptions" :key="String(option.value)" :value="option.value" :disabled="option.disabled">
                    {{ option.label }}
                </option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
                <button
                    v-if="clearable && hasValue"
                    type="button"
                    aria-label="Clear selection"
                    class="s-focus-ring w-6 h-6 rounded flex items-center justify-center s-text-muted z-10"
                    tabindex="-1"
                    @click.stop="clear"
                >
                    <SIcon name="close" size="xs" />
                </button>
                <SIcon name="chevrondown" size="sm" class="s-text-muted pointer-events-none" />
            </div>
        </div>

        <!-- Filterable select (searchable dropdown) -->
        <div v-else class="relative">
            <input
                :id="fieldId"
                ref="inputRef"
                type="text"
                :aria-label="label || placeholder"
                :aria-invalid="errorMessage ? 'true' : undefined"
                :aria-describedby="describedBy"
                :value="open ? query : selectedLabel"
                :placeholder="selectedLabel || placeholder"
                :disabled="isDisabled"
                :class="['s-input w-full rounded-md pr-8', sizeClass, errorMessage ? 's-is-error' : '']"
                :style="controlStyle"
                role="combobox"
                aria-autocomplete="list"
                :aria-expanded="open"
                :aria-activedescendant="open && highlightedIndex >= 0 ? `${fieldId}-opt-${highlightedIndex}` : undefined"
                autocomplete="off"
                @focus="openDropdown"
                @input="onFilterInput"
                @keydown="onKeydown"
            />
            <div class="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
                <button
                    v-if="clearable && hasValue && !open"
                    type="button"
                    aria-label="Clear selection"
                    class="s-focus-ring w-6 h-6 rounded flex items-center justify-center s-text-muted"
                    tabindex="-1"
                    @mousedown.prevent="clear"
                >
                    <SIcon name="close" size="xs" />
                </button>
                <SIcon name="chevrondown" size="sm" class="s-text-muted pointer-events-none" />
            </div>

            <Teleport to="body">
                <Transition name="s-pop">
                    <div
                        v-if="open"
                        ref="dropdownRef"
                        data-overlay
                        role="listbox"
                        class="fixed s-bg-surface border s-border-theme rounded-md shadow-lg max-h-52 overflow-auto origin-top"
                        :style="{ ...dropdownStyle, zIndex: 'var(--s-z-dropdown)' }"
                    >
                        <div v-if="loading" class="px-3 py-2 space-y-2" aria-busy="true">
                            <SSkeleton v-for="i in 3" :key="i" height="4" aria-label="Loading options" />
                        </div>
                        <div v-else-if="filteredOptions.length === 0" class="px-3 py-2 text-xs s-text-muted">{{ emptyText }}</div>
                        <button
                            v-for="(opt, idx) in loading ? [] : filteredOptions"
                            :id="`${fieldId}-opt-${idx}`"
                            :key="String(opt.value)"
                            type="button"
                            role="option"
                            tabindex="-1"
                            :disabled="opt.disabled"
                            :aria-selected="isSelected(opt)"
                            class="s-select-option w-full text-left px-3 py-2 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            :class="[
                                idx === highlightedIndex ? 's-bg-accent-subtle s-text-accent' : 's-text-primary',
                                isSelected(opt) ? 'font-semibold' : '',
                            ]"
                            @mousedown.prevent="selectOption(opt)"
                            @mouseenter="highlightedIndex = idx"
                        >{{ opt.label }}</button>
                    </div>
                </Transition>
            </Teleport>
        </div>

        <p v-if="errorMessage" :id="messageId" class="mt-1 text-xs s-text-danger" role="alert">{{ errorMessage }}</p>
        <p v-else-if="hint" :id="messageId" class="mt-1 text-xs s-text-muted">{{ hint }}</p>
    </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, useId, useSlots, Fragment } from 'vue'
import SIcon from '../icon/SIcon.vue'
import SSkeleton from '../skeleton/SSkeleton.vue'
import SOption from '../option/SOption.vue'
import { firstValidationError } from '../../utils/validation'
import { useListNavigation } from '../../composables/useListNavigation'
import { useFieldDisabled, useFieldId, useFieldSize } from '../../composables/formContext'
import { FIELD_HEIGHTS } from '../../utils/fieldSize'

defineOptions({ name: 'SSelect', inheritAttrs: false })

const props = defineProps({
    modelValue: { type: [String, Number, Boolean], default: '' },
    label: { type: String, default: '' },
    /** Option objects — an alternative to <s-option> children. */
    options: { type: Array, default: () => [] },
    optionLabel: { type: String, default: 'name' },
    optionValue: { type: String, default: 'id' },
    placeholder: { type: String, default: 'Select option' },
    error: { type: [String, Array], default: '' },
    hint: { type: String, default: '' },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    filterable: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    /** Shown when the filter matches nothing. */
    emptyText: { type: String, default: 'No matches' },
    /** xs | sm | md | lg — inherits from the enclosing s-form-item. */
    size: { type: String, default: undefined, validator: (v) => v === undefined || ['xs', 'sm', 'md', 'lg'].includes(v) },
    /** Options are still being fetched — shows placeholders instead of the empty text. */
    loading: { type: Boolean, default: false },
    /** Deprecated no-op (roots are margin-free per the layout-neutrality rule). Kept so existing `inline` usage keeps working. */
    inline: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'change', 'clear', 'visible-change'])

const attrs = useAttrs()
const slots = useSlots()

const wrapperRef = ref(null)
const inputRef = ref(null)
const dropdownRef = ref(null)
const open = ref(false)
const query = ref('')
const dropdownStyle = ref({})

const errorMessage = computed(() => firstValidationError(props.error))
const fallbackId = useId()
const fieldId = useFieldId(() => fallbackId)
const messageId = `${fieldId.value}-message`
const describedBy = computed(() => (errorMessage.value || props.hint ? messageId : undefined))

const fieldSize = useFieldSize(computed(() => props.size))
const isDisabled = useFieldDisabled(computed(() => props.disabled))

const rootClass = computed(() => attrs.class)
const rootStyle = computed(() => attrs.style)
const fieldAttrs = computed(() => {
    const { class: _class, style: _style, ...rest } = attrs
    return rest
})

const SIZE_CLASS = {
    xs: 'px-2 text-xs',
    sm: 'px-2.5 text-xs',
    md: 'px-3 text-sm',
    lg: 'px-3.5 text-base',
}
const sizeClass = computed(() => SIZE_CLASS[fieldSize.value])
const controlStyle = computed(() => ({ '--s-field-h': FIELD_HEIGHTS[fieldSize.value] }))

/** <s-option> children, collected from fragments like SDataTable does. */
function flatten(nodes) {
    return (nodes ?? []).flatMap((node) => (node.type === Fragment ? flatten(node.children ?? []) : [node]))
}

/**
 * A bare boolean attribute (`<s-option disabled />`) reaches the raw vnode as
 * "" rather than true — Vue only normalises it when resolving props on the
 * component itself, which never happens here because the option renders
 * nothing. Treat presence as true, exactly like Vue would.
 */
function bareBoolean(value) {
    return value === '' || value === true
}

const slottedOptions = computed(() =>
    flatten(slots.default?.())
        .filter((node) => node.type === SOption)
        .map((node) => ({
            label: node.props?.label ?? '',
            value: node.props?.value ?? null,
            disabled: bareBoolean(node.props?.disabled),
        })),
)

/** Both sources normalise to { label, value, disabled }. */
const resolvedOptions = computed(() => {
    if (props.options.length) {
        return props.options.map((option) => ({
            label: option[props.optionLabel],
            value: option[props.optionValue],
            disabled: Boolean(option.disabled),
        }))
    }
    return slottedOptions.value
})

const hasValue = computed(() => props.modelValue !== '' && props.modelValue !== null && props.modelValue !== undefined)

const selectedLabel = computed(() => {
    if (!hasValue.value) {
        return ''
    }
    const match = resolvedOptions.value.find((option) => String(option.value) === String(props.modelValue))
    return match?.label ?? ''
})

const filteredOptions = computed(() => {
    if (!props.filterable) {
        return resolvedOptions.value
    }
    const term = query.value.toLowerCase().trim()
    if (!term) {
        return resolvedOptions.value
    }
    return resolvedOptions.value.filter((option) => String(option.label ?? '').toLowerCase().includes(term))
})

function isSelected(option) {
    return String(option.value) === String(props.modelValue)
}

function updateDropdownPosition() {
    if (!inputRef.value) {
        return
    }
    const rect = inputRef.value.getBoundingClientRect()
    dropdownStyle.value = { top: `${rect.bottom + 4}px`, left: `${rect.left}px`, width: `${rect.width}px` }
}

function onNativeChange(e) {
    emit('update:modelValue', e.target.value)
    emit('change', e.target.value)
}

function clear() {
    emit('update:modelValue', '')
    emit('change', '')
    emit('clear')
    closeDropdown()
}

function openDropdown() {
    if (isDisabled.value) {
        return
    }
    resetNavigation()
    open.value = true
    query.value = ''
    emit('visible-change', true)
    nextTick(() => updateDropdownPosition())
}

function closeDropdown() {
    if (!open.value) {
        return
    }
    open.value = false
    query.value = ''
    emit('visible-change', false)
}

function onFilterInput(e) {
    query.value = e.target.value
    if (!open.value) {
        open.value = true
        emit('visible-change', true)
    }
    nextTick(() => updateDropdownPosition())
}

function selectOption(option) {
    if (option.disabled) {
        return
    }
    emit('update:modelValue', option.value)
    emit('change', option.value)
    closeDropdown()
    nextTick(() => inputRef.value?.blur())
}

const { activeIndex: highlightedIndex, onKeydown: onListKeydown, reset: resetNavigation } = useListNavigation(
    filteredOptions,
    {
        onSelect: (option) => selectOption(option),
        onClose: () => closeDropdown(),
        typeahead: false,
        label: (option) => String(option?.label ?? ''),
    },
)

/** List navigation with the dropdown opening on ArrowDown/ArrowUp. */
function onKeydown(event) {
    if (!open.value && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
        event.preventDefault()
        openDropdown()
        return
    }
    onListKeydown(event)
}

function onClickOutside(e) {
    if (wrapperRef.value && !wrapperRef.value.contains(e.target) && (!dropdownRef.value || !dropdownRef.value.contains(e.target))) {
        closeDropdown()
    }
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside))

defineExpose({ open: openDropdown, close: closeDropdown })
</script>

<style>
.s-select-option:hover:not(:disabled) {
    background-color: var(--s-surface-raised);
}
.s-select-option.s-bg-accent-subtle:hover:not(:disabled) {
    background-color: var(--s-accent-subtle);
}
</style>
