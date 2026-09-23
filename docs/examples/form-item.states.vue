<!-- demo: Success and helper — The valid state and the hint slot. -->
<template>
    <div class="max-w-sm space-y-4">
        <s-form-item label="Confirmation" success success-message="Address verified">
            <s-input v-model="code" />
        </s-form-item>
        <s-form-item label="Phone">
            <template #helper>Include the country code.</template>
            <s-input v-model="phone" />
        </s-form-item>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { SFormItem } from '@kundancool/simple-ui'
import { SInput } from '@kundancool/simple-ui'

const code = ref('')
const phone = ref('')
</script>
