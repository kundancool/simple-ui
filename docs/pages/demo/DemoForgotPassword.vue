<template>
    <div>
        <DemoStage title="Live password reset">
            <s-auth-layout title="Acme Inc" subtitle="Reset your password">
                <s-card>
                    <s-steps v-model="step" :steps="[{ key: 'email', label: 'Email' }, { key: 'code', label: 'Code' }, { key: 'new', label: 'New password' }]" />
                    <div class="mt-4 space-y-4">
                        <template v-if="step === 'email'">
                            <s-input v-model="email" label="Account email" placeholder="you@acme.test" :error="emailError" />
                            <s-button class="w-full" :loading="busy" @click="sendCode">Send code</s-button>
                        </template>
                        <template v-else-if="step === 'code'">
                            <s-input v-model="code" label="6-digit code" placeholder="123456" hint="Demo code: 123456" :error="codeError" />
                            <s-button class="w-full" @click="verify">Verify</s-button>
                        </template>
                        <template v-else>
                            <s-input v-model="password" label="New password" type="password" :error="passwordError" />
                            <s-button class="w-full" @click="finish">Update password</s-button>
                        </template>
                    </div>
                    <s-alert v-if="done" variant="success" title="Password updated" class="mt-3">Sign in with your new password.</s-alert>
                </s-card>
            </s-auth-layout>
        </DemoStage>
        <DemoSource file="DemoForgotPassword.vue" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SAuthLayout } from '@kundancool/simple-ui'
import { SCard } from '@kundancool/simple-ui'
import { SSteps } from '@kundancool/simple-ui'
import { SInput } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'
import { SAlert } from '@kundancool/simple-ui'

const step = ref('email')
const email = ref('')
const code = ref('')
const password = ref('')
const busy = ref(false)
const done = ref(false)
const emailError = ref('')
const codeError = ref('')
const passwordError = ref('')

function sendCode() {
    emailError.value = /.+@.+\..+/.test(email.value) ? '' : 'Enter a valid email.'
    if (emailError.value) {
        return
    }
    busy.value = true
    setTimeout(() => {
        busy.value = false
        step.value = 'code'
    }, 600)
}

function verify() {
    codeError.value = code.value.trim() === '123456' ? '' : 'Incorrect code — hint: 123456.'
    if (!codeError.value) {
        step.value = 'new'
    }
}

function finish() {
    passwordError.value = password.value.length >= 8 ? '' : 'Minimum 8 characters.'
    if (!passwordError.value) {
        done.value = true
    }
}
</script>
