<template>
    <div :class="inline ? '' : 'mb-4'" ref="wrapperRef">
        <label v-if="label" :for="fieldId" class="block text-sm font-medium s-text-primary mb-1.5">
            {{ label }}
            <span v-if="required" class="s-text-accent" aria-hidden="true">*</span>
        </label>

        <div v-if="!filterable" class="relative">
            <select
                :id="fieldId"
                :value="modelValue"
                :disabled="disabled"
                :aria-label="label || placeholder"
                :aria-invalid="errorMessage ? 'true' : undefined"
                :aria-describedby="describedBy"
                :class="['s-input w-full px-3 py-2 rounded-md text-sm appearance-none', errorMessage ? 's-is-error' : '']"
                @change="onNativeChange"
            >
                <option value="" disabled>{{ placeholder }}</option>
                <option v-for="option in options" :key="option[optionValue]" :value="option[optionValue]">
                    {{ option[optionLabel] }}
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
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <svg class="w-4 h-4 s-text-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>

        <div v-else class="relative">
            <input
                :id="fieldId"
                ref="inputRef"
                type="text"
                :aria-invalid="errorMessage ? 'true' : undefined"
                :aria-describedby="describedBy"
                :value="open ? query : selectedLabel"
                :placeholder="selectedLabel || placeholder"
                :aria-label="label || placeholder"
                :disabled="disabled"
                :class="['s-input w-full px-3 py-2 rounded-md text-sm pr-8', errorMessage ? 's-is-error' : '']"
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
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <svg class="w-4 h-4 s-text-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            <Teleport to="body">
                <Transition name="s-pop">
                    <div
                        v-if="open"
                        ref="dropdownRef"
                        data-overlay
                        role="listbox"
                        class="fixed s-bg-surface border s-border-theme rounded-md s-shadow-lg-theme max-h-52 overflow-auto origin-top"
                        :style="{ ...dropdownStyle, zIndex: 'var(--s-z-dropdown)' }"
                    >
                        <div v-if="loading" class="px-3 py-2 space-y-2" aria-busy="true">
                            <SSkeleton v-for="i in 3" :key="i" height="4" aria-label="Loading options" />
                        </div>
                        <div v-else-if="filteredOptions.length === 0" class="px-3 py-2 text-xs s-text-muted">No matches</div>
                        <button
                            v-for="(opt, idx) in loading ? [] : filteredOptions"
                            :id="`${fieldId}-opt-${idx}`"
                            :key="opt[optionValue]"
                            type="button"
                            role="option"
                            tabindex="-1"
                            :aria-selected="String(opt[optionValue]) === String(modelValue)"
                            class="s-select-option w-full text-left px-3 py-2 text-sm transition-colors"
                            :class="[
                                idx === highlightedIndex ? 's-bg-accent-subtle s-text-accent' : 's-text-primary',
                                String(opt[optionValue]) === String(modelValue) ? 'font-semibold' : '',
                            ]"
                            @mousedown.prevent="selectOption(opt)"
                            @mouseenter="highlightedIndex = idx"
                        >{{ opt[optionLabel] }}</button>
                    </div>
                </Transition>
            </Teleport>
        </div>

        <p v-if="errorMessage" :id="messageId" class="mt-1 text-xs s-text-danger" role="alert">{{ errorMessage }}</p>
    </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount, useId } from 'vue'
import { firstValidationError } from '../../utils/validation'
import { useListNavigation } from '../../composables/useListNavigation'
import SSkeleton from '../skeleton/SSkeleton.vue'

defineOptions({ name: 'SSelect' })

const props = defineProps({
    modelValue: { type: [String, Number], default: '' },
    label: { type: String, default: '' },
    options: { type: Array, default: () => [] },
    optionLabel: { type: String, default: 'name' },
    optionValue: { type: String, default: 'id' },
    placeholder: { type: String, default: 'Select option' },
    error: { type: [String, Array], default: '' },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    filterable: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    /** Inline mode: no bottom margin, for selects sitting in a centered row. */
    inline: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'change'])

const wrapperRef = ref(null)
const inputRef = ref(null)
const dropdownRef = ref(null)
const open = ref(false)
const query = ref('')
const dropdownStyle = ref({})

const hasValue = computed(() => props.modelValue !== '' && props.modelValue !== null && props.modelValue !== undefined)
const errorMessage = computed(() => firstValidationError(props.error))
const fieldId = useId()
const messageId = `${fieldId}-message`
const describedBy = computed(() => (errorMessage.value ? messageId : undefined))

const selectedLabel = computed(() => {
    if (!hasValue.value) {
        return ''
    }
    const match = props.options.find((o) => String(o[props.optionValue]) === String(props.modelValue))
    return match ? match[props.optionLabel] : ''
})

const filteredOptions = computed(() => {
    if (!props.filterable) {
        return props.options
    }
    const term = query.value.toLowerCase().trim()
    if (!term) {
        return props.options
    }
    return props.options.filter((o) => String(o[props.optionLabel] ?? '').toLowerCase().includes(term))
})

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
    closeDropdown()
}

function openDropdown() {
    if (props.disabled) {
        return
    }
    resetNavigation()
    open.value = true
    query.value = ''
    nextTick(() => updateDropdownPosition())
}

function closeDropdown() {
    open.value = false
    query.value = ''
}

function onFilterInput(e) {
    query.value = e.target.value
    if (!open.value) {
        open.value = true
    }
    nextTick(() => updateDropdownPosition())
}

function selectOption(opt) {
    emit('update:modelValue', opt[props.optionValue])
    emit('change', opt[props.optionValue])
    closeDropdown()
    nextTick(() => inputRef.value?.blur())
}

const { activeIndex: highlightedIndex, onKeydown: onListKeydown, reset: resetNavigation } = useListNavigation(
    filteredOptions,
    {
        onSelect: (opt) => selectOption(opt),
        onClose: () => closeDropdown(),
        typeahead: false,
        label: (opt) => String(opt?.[props.optionLabel] ?? ''),
    },
)

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

onMounted(() => {
    if (props.filterable) {
        document.addEventListener('mousedown', onClickOutside)
    }
})
onBeforeUnmount(() => {
    if (props.filterable) {
        document.removeEventListener('mousedown', onClickOutside)
    }
})
</script>

<style>
.s-select-option:hover {
    background-color: var(--s-surface-raised);
}
.s-select-option.s-bg-accent-subtle:hover {
    background-color: var(--s-accent-subtle);
}
</style>
