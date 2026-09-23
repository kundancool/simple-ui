<template>
    <div>
        <div class="flex items-center gap-2">
            <input
                :id="fieldId"
                type="checkbox"
                :checked="modelValue"
                :disabled="disabled"
                :aria-invalid="errorMessage ? 'true' : undefined"
                class="s-checkbox w-4 h-4 rounded cursor-pointer"
                @change="$emit('update:modelValue', $event.target.checked)"
            />
            <label v-if="label" :for="fieldId" :class="['text-sm cursor-pointer', disabled ? 'opacity-50 cursor-not-allowed' : 's-text-primary']">
                {{ label }}
            </label>
        </div>
        <p v-if="errorMessage" class="mt-1 text-xs s-text-danger" role="alert">{{ errorMessage }}</p>
    </div>
</template>
<script setup>
import { computed, useId } from 'vue'
import { firstValidationError } from '../../utils/validation'

defineOptions({ name: 'SCheckbox' })

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    label: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    error: { type: [String, Array], default: '' },
    /** Deprecated no-op (roots are margin-free per the layout-neutrality rule). Kept so existing `inline` usage keeps working. */
    inline: { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])

/** Ties the label to the box, so its text is a click target and a screen reader reads the two together. */
const fieldId = useId()
const errorMessage = computed(() => firstValidationError(props.error))
</script>

<style>
.s-checkbox {
    border: 1px solid var(--s-border-strong);
    background-color: var(--s-surface);
    accent-color: var(--s-accent);
    color: var(--s-accent);
}
.s-checkbox:focus-visible {
    outline: 2px solid var(--s-accent-text);
    outline-offset: 2px;
}
</style>
