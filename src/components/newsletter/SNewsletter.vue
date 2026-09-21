<template>
    <div class="s-card rounded-xl p-5 md:p-6" :class="align === 'center' ? 'text-center' : 'text-left'">
        <p class="text-base md:text-lg font-bold s-text-primary">{{ title }}</p>
        <p v-if="description" class="text-sm s-text-secondary mt-1" :class="align === 'center' ? 'max-w-md mx-auto' : ''">{{ description }}</p>
        <form class="mt-4 flex flex-col sm:flex-row gap-2" :class="align === 'center' ? 'max-w-md mx-auto' : 'max-w-lg'" @submit.prevent="submit">
            <div class="flex-1 min-w-0">
                <s-input v-model="email" type="email" :placeholder="placeholder" :error="error" inline aria-label="Email address" />
            </div>
            <s-button type="submit" :loading="busy">{{ buttonText }}</s-button>
        </form>
        <p v-if="done" class="text-sm s-text-success font-medium mt-2" role="status">{{ successMessage }}</p>
        <p v-if="hint && !done" class="text-xs s-text-muted mt-2">{{ hint }}</p>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import SInput from '../input/SInput.vue'
import SButton from '../button/SButton.vue'

defineOptions({ name: 'SNewsletter' })

const props = defineProps({
    title: { type: String, default: 'Get product updates' },
    description: { type: String, default: '' },
    placeholder: { type: String, default: 'you@company.test' },
    buttonText: { type: String, default: 'Subscribe' },
    successMessage: { type: String, default: 'You are on the list — welcome!' },
    hint: { type: String, default: '' },
    align: { type: String, default: 'center', validator: (v) => ['left', 'center'].includes(v) },
})

const emit = defineEmits(['submit'])

const email = ref('')
const error = ref('')
const busy = ref(false)
const done = ref(false)

function submit() {
    error.value = /.+@.+\..+/.test(email.value) ? '' : 'Enter a valid email address.'
    if (error.value) {
        return
    }
    busy.value = true
    setTimeout(() => {
        busy.value = false
        done.value = true
        emit('submit', email.value)
    }, 600)
}
</script>
