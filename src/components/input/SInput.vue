<template>
    <div :class="inline ? '' : 'mb-4'">
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
            <textarea
                v-if="type === 'textarea'"
                :id="fieldId"
                :value="modelValue"
                :placeholder="placeholder"
                :disabled="disabled"
                :required="required"
                :rows="rows"
                :aria-invalid="errorMessage ? 'true' : undefined"
                :aria-describedby="describedBy"
                :class="['s-input w-full px-3 py-2 rounded-md text-sm', errorMessage ? 's-is-error' : '']"
                @input="$emit('update:modelValue', $event.target.value)"
            />
            <input
                v-else
                :id="fieldId"
                :type="type"
                :value="modelValue"
                :placeholder="placeholder"
                :disabled="disabled"
                :required="required"
                :min="min"
                :max="max"
                :aria-invalid="errorMessage ? 'true' : undefined"
                :aria-describedby="describedBy"
                :class="['s-input w-full px-3 py-2 rounded-md text-sm', errorMessage ? 's-is-error' : '']"
                @input="$emit('update:modelValue', $event.target.value)"
            />
        </div>
        <p v-if="errorMessage" :id="messageId" class="mt-1 text-xs s-text-danger" role="alert">{{ errorMessage }}</p>
        <p v-else-if="hint" :id="messageId" class="mt-1 text-xs s-text-muted">{{ hint }}</p>
    </div>
</template>

<script setup>
import { computed, useId } from 'vue'
import { firstValidationError } from '../../utils/validation'

defineOptions({ name: 'SInput' })

const props = defineProps({
    modelValue: { type: [String, Number], default: '' },
    label: { type: String, default: '' },
    /** text | password | email | number | tel | url | textarea … (use SDatePicker for dates). */
    type: { type: String, default: 'text' },
    placeholder: { type: String, default: '' },
    /** String or string[] (backend validation bags); first message wins. */
    error: { type: [String, Array], default: '' },
    hint: { type: String, default: '' },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    rows: { type: Number, default: 4 },
    min: { type: [String, Number], default: null },
    max: { type: [String, Number], default: null },
    /** Inline mode: no bottom margin, for inputs sitting in a centered row. */
    inline: { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])

const errorMessage = computed(() => firstValidationError(props.error))
const fieldId = useId()
const messageId = `${fieldId}-message`
const describedBy = computed(() => (errorMessage.value || props.hint ? messageId : undefined))
</script>
