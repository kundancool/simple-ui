<template>
    <div ref="rootRef" class="s-form-item" :class="layoutClass">
        <label v-if="label" :for="inputId" class="s-form-item-label" :style="labelStyle">
            <span class="truncate">{{ label }}</span>
            <span v-if="required" class="s-text-accent" aria-hidden="true">*</span>
        </label>
        <div class="min-w-0 flex-1">
            <slot />
            <p v-if="showError" :id="messageId" class="mt-1 text-xs s-text-danger" role="alert">
                <slot name="error" :message="errorMessage">{{ errorMessage }}</slot>
            </p>
            <p v-else-if="success" class="mt-1 text-xs s-text-success" role="status">
                <slot name="success">{{ successMessage }}</slot>
            </p>
            <p v-else-if="$slots.helper" class="mt-1 text-xs s-text-muted">
                <slot name="helper" />
            </p>
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, useId } from 'vue'
import { DEFAULT_FORM_SIZE, provideFormItemContext, useFormContext } from '../../composables/formContext'
import { firstValidationError } from '../../utils/validation'

defineOptions({ name: 'SFormItem' })

const props = defineProps({
    label: { type: String, default: '' },
    /** Message shown in the error slot. `true` shows the default text. */
    error: { type: [String, Array, Boolean], default: '' },
    /** Marks the field required in the label. */
    required: { type: Boolean, default: false },
    /** Overrides the form size for this one row. */
    size: { type: String, default: undefined, validator: (v) => v === undefined || ['xs', 'sm', 'md', 'lg'].includes(v) },
    /** Shows a success message instead of the helper. */
    success: { type: Boolean, default: false },
    successMessage: { type: String, default: 'Looks good' },
    /** Default error text when `error` is `true`. */
    errorMessage: { type: String, default: 'This field is invalid' },
})

const form = useFormContext()
const rootRef = ref(null)

/** Shared by the label's `for` and the control's `id`. */
const inputId = useId()
const messageId = `${inputId}-message`

const errorMessage = computed(() => {
    if (props.error === true) {
        return props.errorMessage
    }
    return firstValidationError(props.error)
})

const showError = computed(() => props.error !== false && errorMessage.value !== '')

provideFormItemContext({
    inputId,
    size: computed(() => props.size ?? form?.size.value ?? DEFAULT_FORM_SIZE),
    disabled: computed(() => form?.disabled.value ?? false),
    hasError: showError,
})

const isLeft = computed(() => form?.labelPosition.value === 'left')
const layoutClass = computed(() => (isLeft.value ? 's-form-item-left' : 's-form-item-top'))

const labelStyle = computed(() => {
    const width = form?.labelWidth.value
    if (!isLeft.value || !width || width === 'auto') {
        return undefined
    }
    return { width }
})

if (form) {
    const unregister = form.registerItem({
        element: () => rootRef.value,
        hasError: () => showError.value,
    })
    onBeforeUnmount(unregister)
}

defineExpose({ inputId })
</script>

<style>
.s-form-item {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
}
.s-form-item-top {
    flex-direction: column;
    gap: 0;
}
.s-form-item-left {
    flex-direction: row;
    align-items: flex-start;
}
.s-form-item-label {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--s-text-primary);
    flex-shrink: 0;
}
.s-form-item-top > .s-form-item-label {
    margin-bottom: 0.375rem;
}
.s-form-item-left > .s-form-item-label {
    padding-top: 0.5rem;
    min-width: 6rem;
}
</style>
