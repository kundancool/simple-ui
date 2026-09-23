<template>
    <div>
        <span v-if="label" class="block text-sm font-medium s-text-primary mb-1.5">
            {{ label }}
            <span v-if="required" class="s-text-accent" aria-hidden="true">*</span>
        </span>
        <div v-if="showPresets && resolvedPresets.length" class="flex flex-wrap gap-1.5 mb-2" role="group" aria-label="Date presets">
            <button
                v-for="preset in resolvedPresets"
                :key="preset.label"
                type="button"
                class="s-focus-ring px-2.5 py-1 rounded-full text-xs font-medium transition-colors"
                :class="activePreset === preset.label ? 's-bg-accent-subtle s-text-accent' : 's-bg-surface-raised s-text-secondary s-preset-hover'"
                :aria-pressed="activePreset === preset.label"
                @click="applyPreset(preset)"
            >{{ preset.label }}</button>
        </div>
        <div class="s-range-fields">
            <SDatePicker
                :model-value="modelValue"
                range
                inline
                v-bind="calendarAttrs"
                @update:model-value="onManual"
            />
        </div>
        <p v-if="errorMessage" class="mt-1 text-xs s-text-danger" role="alert">{{ errorMessage }}</p>
        <p v-else-if="hint" class="mt-1 text-xs s-text-muted">{{ hint }}</p>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SDatePicker from '../date-picker/SDatePicker.vue'
import { firstValidationError } from '../../utils/validation'
import { defaultRangePresets, normalizePreset, resolvePresets } from '../../utils/datePresets'

defineOptions({ name: 'SDateRangePicker' })

const props = defineProps({
    /** [from, to] as YYYY-MM-DD. */
    modelValue: { type: Array, default: () => [] },
    label: { type: String, default: '' },
    /** null = default preset set. Pass [] to hide via presets, or use showPresets. */
    presets: { type: Array, default: null },
    showPresets: { type: Boolean, default: true },
    placeholder: { type: String, default: 'Select dates' },
    min: { type: String, default: '' },
    max: { type: String, default: '' },
    format: { type: String, default: 'YYYY-MM-DD' },
    error: { type: [String, Array], default: '' },
    hint: { type: String, default: '' },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    /** Visible calendar columns. Defaults to 2 (dashboard-style two-up). */
    columns: { type: Number, default: null },
})

const emit = defineEmits(['update:modelValue', 'change'])

const errorMessage = computed(() => firstValidationError(props.error))
const activePreset = ref('')

const resolvedPresets = computed(() =>
    props.presets === null || props.presets === undefined
        ? defaultRangePresets()
        : resolvePresets(props.presets, true),
)

const calendarAttrs = computed(() => ({
    placeholder: props.placeholder,
    min: props.min,
    max: props.max,
    format: props.format,
    disabled: props.disabled,
    columns: props.columns,
}))

function commit(value, presetLabel = '') {
    activePreset.value = presetLabel
    emit('update:modelValue', value)
    emit('change', value)
}

function applyPreset(preset) {
    const value = normalizePreset(preset, true)
    if (value === null) {
        return
    }
    commit([value[0], value[1]], preset.label)
}

function onManual(value) {
    commit(value, '')
}
</script>

<style>
.s-preset-hover:hover {
    color: var(--s-text-primary);
    background-color: var(--s-accent-subtle);
}
</style>
