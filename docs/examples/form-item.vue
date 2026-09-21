<template>
    <s-form-item label="Customer name" required :error="error">
        <s-input v-model="name" />
    </s-form-item>
    <s-form-item label="Confirmation" success success-message="Address verified">
        <s-input v-model="code" />
    </s-form-item>
    <s-form-item label="Phone" hint="helper slot wins when there is no error">
        <template #helper>Include the country code.</template>
        <s-input v-model="phone" />
    </s-form-item>
    <div class="flex gap-2">
        <s-button size="sm" variant="secondary" @click="error = error ? '' : 'Name is required'">
            {{ error ? 'Clear error' : 'Show error' }}
        </s-button>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { SFormItem } from '@kundancool/simple-ui'
import { SInput } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'

const name = ref('')
const code = ref('')
const phone = ref('')
const error = ref('')
</script>
