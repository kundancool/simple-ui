<template>
    <SDialog :model-value="modelValue" :title="title" width="sm" @update:model-value="emit('update:modelValue', $event)">
        <p v-if="message" class="text-sm s-text-secondary">{{ message }}</p>
        <slot />
        <div class="mt-4">
            <label class="block text-sm font-medium s-text-secondary mb-1.5">
                Type <span class="font-semibold s-text-primary">{{ expected }}</span> to confirm
            </label>
            <input
                ref="inputRef"
                v-model="typed"
                type="text"
                autocomplete="off"
                autocapitalize="off"
                spellcheck="false"
                :placeholder="expected"
                class="s-input w-full px-3.5 py-2.5 rounded-lg text-sm"
                :class="mismatch ? 's-is-error' : ''"
                @keyup.enter="onEnter"
            />
            <p v-if="mismatch" class="mt-1.5 text-xs s-text-danger">That does not match the {{ label }} name.</p>
        </div>
        <template #footer>
            <SButton variant="secondary" @click="emit('update:modelValue', false)">{{ cancelText }}</SButton>
            <SButton :variant="confirmVariant" :disabled="!matches" :loading="loading" @click="emit('confirm')">
                {{ confirmText }}
            </SButton>
        </template>
    </SDialog>
</template>

<script setup>
/**
 * Confirmation gated on retyping the record's name — a reflex click cannot
 * get past it. Nothing model-specific: pass any record name + a noun.
 */
import { ref, computed, nextTick, watch } from 'vue'
import SDialog from '../dialog/SDialog.vue'
import SButton from '../button/SButton.vue'

defineOptions({ name: 'SConfirmByNameDialog' })

const props = defineProps({
    modelValue: { type: Boolean, required: true },
    title: { type: String, required: true },
    message: { type: String, default: '' },
    /** Exact text the user must reproduce. */
    expected: { type: String, required: true },
    label: { type: String, default: 'record' },
    confirmText: { type: String, default: 'Confirm' },
    cancelText: { type: String, default: 'Cancel' },
    confirmVariant: { type: String, default: 'danger' },
    loading: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const typed = ref('')
const inputRef = ref(null)

const normalise = (value) => String(value ?? '').trim().toLocaleLowerCase()
const matches = computed(() => normalise(typed.value) === normalise(props.expected) && normalise(props.expected) !== '')
const mismatch = computed(() => typed.value.length > 0 && !matches.value)

function onEnter() {
    if (matches.value && !props.loading) {
        emit('confirm')
    }
}

watch(
    () => props.modelValue,
    async (open) => {
        if (!open) {
            return
        }
        typed.value = ''
        await nextTick()
        inputRef.value?.focus()
    },
)
</script>
