<template>
    <div :class="[wrapper === 'block' ? '' : 'inline-flex flex-col']">
        <label v-if="label" :for="fieldId" class="block text-sm font-medium s-text-primary mb-1.5">
            {{ label }}
            <span v-if="required" class="s-text-accent" aria-hidden="true">*</span>
        </label>
        <div class="s-number-wrap inline-flex items-stretch rounded-md border s-border-input s-bg-surface-raised overflow-hidden" :class="errorMessage ? 's-is-error s-border-danger' : ''" :style="controlStyle">
            <button
                type="button"
                class="s-stepper-btn inline-flex items-center justify-center px-2.5 s-text-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                :disabled="disabled || atMin"
                aria-label="Decrement"
                @click="step(-1)"
            >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" d="M5 12h14" />
                </svg>
            </button>
            <input
                :id="fieldId"
                type="number"
                :value="modelValue"
                :aria-invalid="errorMessage ? 'true' : undefined"
                :aria-describedby="describedBy"
                :min="min"
                :max="max"
                :step="stepBy"
                :disabled="disabled"
                :placeholder="placeholder"
                :class="['w-14 h-full text-center bg-transparent s-text-primary px-1 py-0 border-x s-border-theme s-no-spinner', TEXT_CLASS[fieldSize]]"
                @input="onInput($event.target.value)"
                @blur="clamp"
            />
            <button
                type="button"
                class="s-stepper-btn inline-flex items-center justify-center px-2.5 s-text-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                :disabled="disabled || atMax"
                aria-label="Increment"
                @click="step(1)"
            >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>
        </div>
        <p v-if="errorMessage" :id="messageId" class="mt-1 text-xs s-text-danger" role="alert">{{ errorMessage }}</p>
        <p v-else-if="hint" :id="messageId" class="mt-1 text-xs s-text-muted">{{ hint }}</p>
    </div>
</template>

<script setup>
import { computed, useId } from 'vue'
import { firstValidationError } from '../../utils/validation'
import { FIELD_HEIGHTS, isFieldSize } from '../../utils/fieldSize'
import { useFieldSize } from '../../composables/formContext'

defineOptions({ name: 'SNumberInput' })

const props = defineProps({
    modelValue: { type: [Number, String], default: 0 },
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    min: { type: Number, default: 0 },
    max: { type: Number, default: Infinity },
    stepBy: { type: Number, default: 1 },
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    error: { type: [String, Array], default: '' },
    hint: { type: String, default: '' },
    /** block stacks the label above; inline sits beside other controls. */
    wrapper: { type: String, default: 'block' },
    /** xs | sm | md | lg — inherits from the enclosing s-form-item when omitted. */
    size: { type: String, default: undefined, validator: isFieldSize },
})

const emit = defineEmits(['update:modelValue', 'change'])

const numericValue = computed(() => {
    const n = Number(props.modelValue)
    return Number.isFinite(n) ? n : props.min
})
const errorMessage = computed(() => firstValidationError(props.error))

/** Shared height scale so the stepper lines up with inputs and selects. */
const fieldSize = useFieldSize(computed(() => props.size))
const TEXT_CLASS = { xs: 'text-xs', sm: 'text-xs', md: 'text-sm', lg: 'text-base', xl: 'text-base', '2xl': 'text-lg', '3xl': 'text-xl' }
const controlStyle = computed(() => ({ '--s-field-h': FIELD_HEIGHTS[fieldSize.value] }))
const fieldId = useId()
const messageId = `${fieldId}-message`
const describedBy = computed(() => (errorMessage.value || props.hint ? messageId : undefined))
const atMin = computed(() => numericValue.value <= props.min)
const atMax = computed(() => numericValue.value >= props.max)

function emitValue(next) {
    const clamped = Math.max(props.min, Math.min(props.max, next))
    emit('update:modelValue', clamped)
    emit('change', clamped)
}

function step(direction) {
    if (props.disabled) {
        return
    }
    emitValue(numericValue.value + direction * props.stepBy)
}

function onInput(raw) {
    if (raw === '') {
        emit('update:modelValue', '')
        return
    }
    const parsed = Number(raw)
    if (!Number.isFinite(parsed)) {
        return
    }
    emit('update:modelValue', parsed)
}

function clamp() {
    emitValue(numericValue.value)
}
</script>

<style>
.s-number-wrap {
    height: var(--s-field-h, var(--s-control-h));
    box-sizing: border-box;
    box-shadow: var(--s-shadow-xs);
}
.s-number-wrap:focus-within {
    outline: none;
    border-color: var(--s-accent-text);
    box-shadow: 0 0 0 3px var(--s-accent-subtle);
}
.s-number-wrap:focus-within input:focus {
    outline: none;
}
.s-number-wrap.s-is-error:focus-within {
    border-color: var(--s-danger);
    box-shadow: 0 0 0 3px var(--s-danger-subtle);
}
.s-stepper-btn:hover:not(:disabled) {
    background-color: var(--s-surface-raised);
}
.s-number-error {
    border-color: var(--s-danger);
}
</style>
