<template>
    <div ref="wrapperRef">
        <label v-if="label" :for="fieldId" class="block text-sm font-medium s-text-primary mb-1.5">
            {{ label }}
            <span v-if="required" class="s-text-accent" aria-hidden="true">*</span>
        </label>

        <div class="relative">
            <button
                :id="fieldId"
                ref="triggerRef"
                type="button"
                :disabled="disabled"
                aria-haspopup="listbox"
                :aria-expanded="open"
                :aria-activedescendant="open && activeIndex >= 0 ? `${fieldId}-opt-${activeIndex}` : undefined"
                :aria-invalid="errorMessage ? 'true' : undefined"
                :aria-describedby="describedBy"
                :class="[
                    's-input w-full rounded-md text-left flex items-center gap-1.5', SIZE_CLASS[fieldSize],
                    errorMessage ? 's-is-error' : '',
                    disabled ? 'opacity-50 cursor-not-allowed' : '',
                ]"
                :style="controlStyle"
                @click="toggleOpen"
                @keydown="onKeydown"
            >
                <div v-if="modelValue.length === 0" class="s-text-placeholder flex-1 truncate">
                    {{ placeholder }}
                </div>
                <div v-else class="flex items-center gap-1 flex-1 min-w-0">
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 s-bg-accent-subtle s-text-accent rounded text-xs truncate max-w-[140px]">
                        {{ selectedOptions[0]?.[optionLabel] }}
                    </span>
                    <span v-if="selectedOptions.length > 1" class="text-xs s-text-muted">
                        +{{ selectedOptions.length - 1 }}
                    </span>
                </div>
                <svg class="w-4 h-4 s-text-muted flex-shrink-0 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <Teleport to="body">
                <Transition name="s-pop">
                    <div
                        v-if="open"
                        ref="dropdownRef"
                        data-overlay
                        role="listbox"
                        aria-multiselectable="true"
                        class="fixed s-bg-surface border s-border-theme rounded-md s-shadow-lg-theme overflow-hidden origin-top"
                        :style="{ ...dropdownStyle, zIndex: 'var(--s-z-dropdown)' }"
                    >
                        <div v-if="searchable" class="p-2 border-b s-border-theme">
                            <input v-model="search" type="text" placeholder="Search..." class="s-input w-full px-2 rounded text-xs" :style="{ '--s-field-h': FIELD_HEIGHTS.sm }" />
                        </div>
                        <div class="max-h-52 overflow-y-auto">
                            <div v-if="loading" class="px-3 py-2 space-y-2" aria-busy="true">
                                <SSkeleton v-for="i in 3" :key="i" height="4" aria-label="Loading options" />
                            </div>
                            <div v-else-if="filteredOptions.length === 0" class="px-3 py-2 text-xs s-text-muted">No matches</div>
                            <button
                                v-for="(opt, index) in loading ? [] : filteredOptions"
                                :id="`${fieldId}-opt-${index}`"
                                :key="opt[optionValue]"
                                type="button"
                                tabindex="-1"
                                role="option"
                                :aria-selected="isSelected(opt)"
                                class="w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition-colors"
                                :class="[
                                    isSelected(opt) ? 's-bg-accent-subtle s-text-accent' : 's-text-primary s-multi-option',
                                    index === activeIndex ? 's-multi-active' : '',
                                ]"
                                @mousedown.prevent="toggle(opt)"
                            >
                                <span
                                    class="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors"
                                    :class="isSelected(opt) ? 's-bg-accent s-border-accent' : 's-border-strong'"
                                    aria-hidden="true"
                                >
                                    <svg v-if="isSelected(opt)" class="w-3 h-3 s-text-on-accent" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </span>
                                {{ opt[optionLabel] }}
                            </button>
                        </div>
                    </div>
                </Transition>
            </Teleport>
        </div>

        <p v-if="errorMessage" :id="messageId" class="mt-1 text-xs s-text-danger" role="alert">{{ errorMessage }}</p>
    </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount, useId } from 'vue'
import { useListNavigation } from '../../composables/useListNavigation'
import SSkeleton from '../skeleton/SSkeleton.vue'
import { firstValidationError } from '../../utils/validation'
import { FIELD_HEIGHTS, isFieldSize } from '../../utils/fieldSize'
import { useFieldSize } from '../../composables/formContext'

defineOptions({ name: 'SMultiSelect' })

const props = defineProps({
    modelValue: { type: Array, default: () => [] },
    label: { type: String, default: '' },
    options: { type: Array, default: () => [] },
    optionLabel: { type: String, default: 'name' },
    optionValue: { type: String, default: 'id' },
    placeholder: { type: String, default: 'Select options' },
    error: { type: [String, Array], default: '' },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    searchable: { type: Boolean, default: true },
    loading: { type: Boolean, default: false },
    /** xs | sm | md | lg — inherits from the enclosing s-form-item when omitted. */
    size: { type: String, default: undefined, validator: isFieldSize },
})

const emit = defineEmits(['update:modelValue', 'change'])

const wrapperRef = ref(null)
const triggerRef = ref(null)
const dropdownRef = ref(null)
const open = ref(false)
const search = ref('')
const dropdownStyle = ref({})

const errorMessage = computed(() => firstValidationError(props.error))

/** Shared height scale so the trigger lines up with inputs and selects. */
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
const describedBy = computed(() => (errorMessage.value ? messageId : undefined))

const selectedOptions = computed(() =>
    props.options.filter((o) => props.modelValue.some((v) => String(v) === String(o[props.optionValue]))),
)

const filteredOptions = computed(() => {
    const term = search.value.toLowerCase().trim()
    if (!term) {
        return props.options
    }
    return props.options.filter((o) => String(o[props.optionLabel] ?? '').toLowerCase().includes(term))
})

function isSelected(opt) {
    return props.modelValue.some((v) => String(v) === String(opt[props.optionValue]))
}

function toggle(opt) {
    const value = opt[props.optionValue]
    const next = isSelected(opt)
        ? props.modelValue.filter((v) => String(v) !== String(value))
        : [...props.modelValue, value]
    emit('update:modelValue', next)
    emit('change', next)
}

function toggleOpen() {
    if (props.disabled) {
        return
    }
    open.value = !open.value
    if (open.value) {
        search.value = ''
        resetNavigation()
        nextTick(updateDropdownPosition)
    }
}

function updateDropdownPosition() {
    if (!triggerRef.value) {
        return
    }
    const rect = triggerRef.value.getBoundingClientRect()
    dropdownStyle.value = { top: `${rect.bottom + 4}px`, left: `${rect.left}px`, width: `${rect.width}px` }
}

const { activeIndex, onKeydown, reset: resetNavigation } = useListNavigation(filteredOptions, {
    onSelect: (opt) => toggle(opt),
    onClose: () => {
        open.value = false
    },
    typeahead: false,
    label: (opt) => String(opt?.[props.optionLabel] ?? ''),
})

function onClickOutside(e) {
    if (wrapperRef.value && !wrapperRef.value.contains(e.target) && (!dropdownRef.value || !dropdownRef.value.contains(e.target))) {
        open.value = false
    }
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside))
</script>

<style>
.s-multi-option:hover {
    background-color: var(--s-surface-raised);
}
.s-multi-active {
    box-shadow: inset 0 0 0 1px var(--s-accent-border);
}
</style>
