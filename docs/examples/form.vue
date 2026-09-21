<template>
    <s-form ref="formRef" label-position="left" label-width="150px" :disabled="saving" @submit="save">
        <s-form-item label="Customer name" required :error="errors.name">
            <s-input v-model="values.name" placeholder="Full name" autocomplete="name" />
        </s-form-item>
        <s-form-item label="Email" required :error="errors.email">
            <s-input v-model="values.email" type="email" placeholder="you@example.test" autocomplete="email" />
        </s-form-item>
        <s-form-item label="Notes" helper="Visible to the support only.">
            <s-input v-model="values.notes" type="textarea" :rows="2" />
        </s-form-item>
        <div class="flex gap-2">
            <s-button type="submit" :loading="saving">Save</s-button>
            <s-button variant="secondary" type="button" @click="fail">Simulate server errors</s-button>
        </div>
    </s-form>
    <p class="text-xs s-text-muted mt-2">Sizes cascade: this form sets size="sm".</p>
</template>

<script setup>
import { ref } from 'vue'
import { SForm } from '@kundancool/simple-ui'
import { SFormItem } from '@kundancool/simple-ui'
import { SInput } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'

const formRef = ref(null)
const values = ref({ name: '', email: '', notes: '' })
const errors = ref({ name: '', email: '' })
const saving = ref(false)

function fail() {
    errors.value = {
        name: 'Name is required (this is why there is no leaf)',
        email: 'That does not look like an email address',
    }
    formRef.value?.scrollToFirstError()
}

function save() {
    errors.value = { name: values.value.name ? '' : 'Name is required', email: values.value.email ? '' : 'Email is required' }
    if (errors.value.name || errors.value.email) {
        formRef.value?.scrollToFirstError()
        return
    }
    saving.value = true
    setTimeout(() => {
        saving.value = false
    }, 700)
}
</script>
