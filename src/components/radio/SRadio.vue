<template>
    <label
        class="s-radio"
        :class="[disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer', sizeClass]"
    >
        <input
            type="radio"
            class="s-radio-input"
            :name="name || undefined"
            :value="value"
            :checked="isChecked"
            :disabled="disabled"
            :aria-describedby="undefined"
            @change="select"
        />
        <span class="s-radio-dot" aria-hidden="true"><span class="s-radio-dot-inner" /></span>
        <span v-if="$slots.default" class="s-radio-label"><slot /></span>
    </label>
</template>

<script setup>
import { computed, inject } from 'vue'

defineOptions({ name: 'SRadio' })

const props = defineProps({
    /** Standalone use; inside SRadioGroup the group owns the value. */
    modelValue: { type: [String, Number, Boolean], default: undefined },
    /** The value this radio represents. */
    value: { type: [String, Number, Boolean], default: null },
    label: { type: [String, Number, Boolean], default: undefined },
    disabled: { type: Boolean, default: false },
    size: { type: String, default: undefined, validator: (v) => v === undefined || ['xs', 'sm', 'md', 'lg'].includes(v) },
    /** Native radio group name; inherited from SRadioGroup. */
    name: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'change'])

const group = inject('s-radio-group', null)

/** `label` is the app's historical name for the option value. */
const value = computed(() => (props.label !== undefined ? props.label : props.value))

const isChecked = computed(() => {
    const current = group ? group.modelValue.value : props.modelValue
    return current === value.value
})

const disabled = computed(() => props.disabled || (group?.disabled.value ?? false))
const name = computed(() => props.name || group?.name.value || '')
const sizeClass = computed(() => `s-radio-${props.size ?? group?.size.value ?? 'md'}`)

function select() {
    if (disabled.value) {
        return
    }
    group?.select(value.value)
    emit('update:modelValue', value.value)
    emit('change', value.value)
}
</script>

<style>
.s-radio {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--s-text-primary);
}
.s-radio-input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
}
.s-radio-dot {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-radius: 9999px;
    border: 1px solid var(--s-border-strong);
    background-color: var(--s-surface);
    transition: border-color 150ms ease, background-color 150ms ease;
}
.s-radio-dot-inner {
    border-radius: 9999px;
    background-color: var(--s-text-on-solid);
    transform: scale(0);
    transition: transform 150ms ease;
}
.s-radio-xs .s-radio-dot { width: 0.875rem; height: 0.875rem; }
.s-radio-sm .s-radio-dot { width: 1rem; height: 1rem; }
.s-radio-md .s-radio-dot { width: 1rem; height: 1rem; }
.s-radio-lg .s-radio-dot { width: 1.25rem; height: 1.25rem; }
.s-radio-xs .s-radio-dot-inner { width: 0.375rem; height: 0.375rem; }
.s-radio-sm .s-radio-dot-inner,
.s-radio-md .s-radio-dot-inner { width: 0.5rem; height: 0.5rem; }
.s-radio-lg .s-radio-dot-inner { width: 0.625rem; height: 0.625rem; }
.s-radio-xs { font-size: 0.75rem; }
.s-radio-sm,
.s-radio-md { font-size: 0.875rem; }
.s-radio-lg { font-size: 1rem; }

.s-radio-input:checked + .s-radio-dot {
    border-color: var(--s-accent);
    background-color: var(--s-accent);
}
.s-radio-input:checked + .s-radio-dot .s-radio-dot-inner {
    transform: scale(1);
}
.s-radio-input:focus-visible + .s-radio-dot {
    outline: 2px solid var(--s-accent-text);
    outline-offset: 2px;
}
</style>
