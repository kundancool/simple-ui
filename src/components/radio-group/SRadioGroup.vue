<template>
    <div
        class="s-radio-group"
        :class="inline ? 'flex-wrap items-center gap-4' : 'flex-col gap-2'"
        role="radiogroup"
        :aria-label="ariaLabel || undefined"
    >
        <slot />
        <p v-if="errorMessage" class="text-xs s-text-danger" role="alert">{{ errorMessage }}</p>
    </div>
</template>

<script setup>
import { computed, provide, toRef } from 'vue'
import { firstValidationError } from '../../utils/validation'
import { useFieldDisabled, useFieldSize } from '../../composables/formContext'
import { isFieldSize } from '../../utils/fieldSize'

defineOptions({ name: 'SRadioGroup' })

const props = defineProps({
    modelValue: { type: [String, Number, Boolean], default: null },
    disabled: { type: Boolean, default: false },
    size: { type: String, default: undefined, validator: isFieldSize },
    /** Native radio name shared by the options. */
    name: { type: String, default: '' },
    /** Lay the options out in a row instead of a column. */
    inline: { type: Boolean, default: false },
    error: { type: [String, Array], default: '' },
    ariaLabel: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'change'])

const isDisabled = useFieldDisabled(computed(() => props.disabled))
const fieldSize = useFieldSize(computed(() => props.size))
const errorMessage = computed(() => firstValidationError(props.error))

/** Radios read value/disabled/size from here so they only declare their own value. */
provide('s-radio-group', {
    modelValue: toRef(props, 'modelValue'),
    disabled: isDisabled,
    size: fieldSize,
    name: toRef(props, 'name'),
    select(value) {
        emit('update:modelValue', value)
        emit('change', value)
    },
})
</script>
