<template>
    <SDialog
        :model-value="modelValue"
        :title="title"
        width="sm"
        @update:model-value="emit('update:modelValue', $event)"
        @cancel="emit('cancel')"
    >
        <p v-if="message" class="text-sm s-text-secondary">{{ message }}</p>
        <slot />
        <template #footer>
            <SButton variant="secondary" :disabled="loading" @click="emit('update:modelValue', false); emit('cancel')">
                {{ cancelText }}
            </SButton>
            <SButton :variant="resolvedVariant" :loading="loading" @click="emit('confirm')">
                {{ confirmText }}
            </SButton>
        </template>
    </SDialog>
</template>

<script setup>
import { computed } from 'vue'
import SDialog from '../dialog/SDialog.vue'
import SButton from '../button/SButton.vue'

defineOptions({ name: 'SConfirmDialog' })

const props = defineProps({
    modelValue: { type: Boolean, required: true },
    title: { type: String, required: true },
    message: { type: String, default: '' },
    confirmText: { type: String, default: 'Confirm' },
    cancelText: { type: String, default: 'Cancel' },
    confirmVariant: { type: String, default: 'danger' },
    loading: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const resolvedVariant = computed(() => props.confirmVariant || 'danger')
</script>
