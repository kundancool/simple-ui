<template>
    <div :class="[rootClass]" :style="rootStyle">
        <div v-if="label || $slots.trailing" class="flex items-center justify-between mb-1.5">
            <label v-if="label" :for="fieldId" class="block text-sm font-medium s-text-primary">
                {{ label }}
                <span v-if="required" class="s-text-accent" aria-hidden="true">*</span>
            </label>
            <div v-if="$slots.trailing" class="flex items-center">
                <slot name="trailing" />
            </div>
        </div>

        <div class="relative">
            <!-- Leading adornment -->
            <span v-if="$slots.prefix" class="s-field-adornment left-0 flex items-center pl-3">
                <slot name="prefix" />
            </span>

            <textarea
                v-if="type === 'textarea'"
                :id="fieldId"
                ref="controlRef"
                :value="modelValue"
                :placeholder="placeholder"
                :disabled="isDisabled"
                :readonly="readonly"
                :required="required"
                :rows="rows"
                :aria-invalid="showError ? 'true' : undefined"
                :aria-describedby="describedBy"
                :maxlength="maxlength ?? undefined"
                :class="[fieldClass, $slots.prefix ? 'pl-9' : '', $slots.suffix ? 'pr-9' : '', showError ? 's-is-error' : '']"
                :style="controlStyle"
                v-bind="fieldAttrs"
                @input="onInput"
                @change="$emit('change', $event.target.value)"
                @blur="$emit('blur', $event)"
                @focus="$emit('focus', $event)"
            />

            <input
                v-else
                :id="fieldId"
                ref="controlRef"
                :type="resolvedType"
                :value="modelValue"
                :placeholder="placeholder"
                :disabled="isDisabled"
                :readonly="readonly"
                :required="required"
                :aria-invalid="showError ? 'true' : undefined"
                :aria-describedby="describedBy"
                :maxlength="maxlength ?? undefined"
                :class="[fieldClass, $slots.prefix ? 'pl-9' : '', clearable || isPassword || $slots.suffix ? 'pr-9' : '', showError ? 's-is-error' : '']"
                :style="controlStyle"
                v-bind="fieldAttrs"
                @input="onInput"
                @change="$emit('change', $event.target.value)"
                @blur="$emit('blur', $event)"
                @focus="$emit('focus', $event)"
            />

            <!-- Trailing adornment: clear, reveal, custom -->
            <span class="s-field-adornment right-0 flex items-center gap-1 pr-3">
                <button
                    v-if="clearable && hasValue && !isDisabled && !readonly"
                    type="button"
                    class="s-field-action"
                    aria-label="Clear"
                    tabindex="-1"
                    @mousedown.prevent
                    @click="clear"
                >
                    <SIcon name="close" size="xs" />
                </button>
                <button
                    v-if="isPassword"
                    type="button"
                    class="s-field-action"
                    :aria-label="revealed ? 'Hide password' : 'Show password'"
                    tabindex="-1"
                    @mousedown.prevent
                    @click="toggleReveal"
                >
                    <SIcon :name="revealed ? 'eyeoff' : 'view'" size="xs" />
                </button>
                <slot name="suffix" />
            </span>
        </div>

        <div v-if="showError || hint || showWordLimit" class="flex items-start justify-between gap-3">
            <p v-if="showError" :id="messageId" class="mt-1 text-xs s-text-danger" role="alert">{{ errorMessage }}</p>
            <p v-else-if="hint" :id="messageId" class="mt-1 text-xs s-text-muted">{{ hint }}</p>
            <span v-else />
            <p v-if="showWordLimit && maxlength" class="mt-1 text-xs s-text-muted tabular-nums">{{ length }}/{{ maxlength }}</p>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, useAttrs, useId } from 'vue'
import SIcon from '../icon/SIcon.vue'
import { firstValidationError } from '../../utils/validation'
import { useFieldDisabled, useFieldId, useFieldSize } from '../../composables/formContext'
import { FIELD_HEIGHTS } from '../../utils/fieldSize'

defineOptions({ name: 'SInput', inheritAttrs: false })

const props = defineProps({
    modelValue: { type: [String, Number], default: '' },
    label: { type: String, default: '' },
    /** text | password | email | number | tel | url | textarea … (use SDatePicker for dates). */
    type: { type: String, default: 'text' },
    placeholder: { type: String, default: '' },
    /** Message, message list, or `true` for a bare error border. */
    error: { type: [String, Array, Boolean], default: '' },
    hint: { type: String, default: '' },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    /** xs | sm | md | lg — inherits from the enclosing s-form-item when omitted. */
    size: { type: String, default: undefined, validator: (v) => v === undefined || ['xs', 'sm', 'md', 'lg'].includes(v) },
    maxlength: { type: [String, Number], default: null },
    showWordLimit: { type: Boolean, default: false },
    rows: { type: Number, default: 4 },
    min: { type: [String, Number], default: null },
    max: { type: [String, Number], default: null },
    /** Deprecated no-op (roots are margin-free per the layout-neutrality rule). Kept so existing `inline` usage keeps working. */
    inline: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'input', 'change', 'blur', 'focus', 'clear', 'toggle-visibility'])

const attrs = useAttrs()
const controlRef = ref(null)
const revealed = ref(false)

const ownSize = computed(() => props.size)
const fieldSize = useFieldSize(ownSize)
const isDisabled = useFieldDisabled(computed(() => props.disabled))

const fallbackId = useId()
const fieldId = useFieldId(() => fallbackId)
const messageId = `${fieldId.value}-message`

/** class/style stay on the wrapper; everything else reaches the real control. */
const rootClass = computed(() => attrs.class)
const rootStyle = computed(() => attrs.style)
const fieldAttrs = computed(() => {
    const { class: _class, style: _style, ...rest } = attrs
    return rest
})

const errorMessage = computed(() => (props.error === true ? '' : firstValidationError(props.error)))
const showError = computed(() => props.error !== false && props.error !== '' && props.error != null)
const hasValue = computed(() => props.modelValue !== '' && props.modelValue !== null && props.modelValue !== undefined)
const isPassword = computed(() => props.type === 'password')
const resolvedType = computed(() => (isPassword.value && revealed.value ? 'text' : props.type))
const length = computed(() => String(props.modelValue ?? '').length)

const describedBy = computed(() => (showError.value || props.hint ? messageId : undefined))

/** Size scale resolves through the shared control-height contract (01). */
const PADDING = {
    xs: 'px-2 py-0 text-xs',
    sm: 'px-2.5 py-0 text-xs',
    md: 'px-3 py-0 text-sm',
    lg: 'px-3.5 py-0 text-base',
    xl: 'px-4 py-0 text-base',
    '2xl': 'px-5 py-0 text-lg',
    '3xl': 'px-6 py-0 text-xl',
}

/** Textareas keep multi-line padding plus the size text step. */
const TEXT_SIZE = { xs: 'text-xs', sm: 'text-xs', md: 'text-sm', lg: 'text-base' }

const fieldClass = computed(() => [
    's-input w-full rounded-md',
    props.type === 'textarea' ? ['px-3 py-2', TEXT_SIZE[fieldSize.value]] : PADDING[fieldSize.value],
])

const controlStyle = computed(() => {
    if (props.type === 'textarea') {
        return undefined
    }
    return { '--s-field-h': FIELD_HEIGHTS[fieldSize.value] }
})

function onInput(event) {
    const value = event.target.value
    emit('update:modelValue', value)
    emit('input', value)
}

function clear() {
    emit('update:modelValue', '')
    emit('input', '')
    emit('clear')
    controlRef.value?.focus()
}

function toggleReveal() {
    revealed.value = !revealed.value
    emit('toggle-visibility', revealed.value)
}

defineExpose({ focus: () => controlRef.value?.focus(), input: controlRef })
</script>

<style>
.s-field-adornment {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 1;
    color: var(--s-text-muted);
}
.s-field-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.25rem;
    padding: 0.125rem;
    color: var(--s-text-muted);
    transition: color 150ms ease;
}
.s-field-action:hover {
    color: var(--s-text-primary);
}
</style>
