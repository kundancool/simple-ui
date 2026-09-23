<template>
    <s-form-item label="Customer name" required :error="error">
        <s-input v-model="name" />
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
const error = ref('')
</script>
