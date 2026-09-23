<template>
    <div>
        <DemoStage title="Live email verification">
            <s-auth-layout title="Acme Inc" subtitle="Verify your email to continue">
                <s-card>
                    <div class="text-center">
                        <span class="inline-flex w-12 h-12 rounded-full s-bg-accent-subtle items-center justify-center"><MailCheck class="w-6 h-6 s-text-accent" /></span>
                        <p class="text-sm font-semibold s-text-primary mt-3">Check your inbox</p>
                        <p class="text-sm s-text-secondary mt-1">We sent a 6-digit code to <span class="font-medium s-text-primary">you@acme.test</span></p>
                    </div>
                    <div class="flex justify-center gap-2 mt-4">
                        <input
                            v-for="(_, i) in 6"
                            :key="i"
                            :ref="(el) => boxes[i] = el"
                            v-model="digits[i]"
                            maxlength="1"
                            inputmode="numeric"
                            aria-label="Digit"
                            class="s-input w-11 text-center text-lg font-semibold rounded-lg"
                            style="--s-field-h: 48px"
                            @input="onDigit(i)"
                            @keydown.backspace="onBackspace(i, $event)"
                        />
                    </div>
                    <p v-if="error" class="text-xs s-text-danger text-center mt-2" role="alert">{{ error }}</p>
                    <s-button class="w-full mt-4" :loading="busy" @click="verify">Verify email</s-button>
                    <p class="text-xs s-text-muted text-center mt-3">Didn't get it? <button type="button" class="s-text-accent font-medium" @click="resent = true">Resend code</button></p>
                    <s-alert v-if="resent" variant="info" class="mt-3">New code sent.</s-alert>
                    <s-alert v-if="done" variant="success" title="Verified" class="mt-3">Your email is confirmed.</s-alert>
                </s-card>
            </s-auth-layout>
        </DemoStage>
        <DemoSource file="DemoVerifyEmail.vue" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { MailCheck } from 'lucide-vue-next'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SAuthLayout } from '@kundancool/simple-ui'
import { SCard } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'
import { SAlert } from '@kundancool/simple-ui'

const digits = ref(Array(6).fill(''))
const boxes = ref([])
const error = ref('')
const busy = ref(false)
const done = ref(false)
const resent = ref(false)

function onDigit(i) {
    digits.value[i] = digits.value[i].replace(/\D/g, '').slice(-1)
    if (digits.value[i] && i < 5) {
        boxes.value[i + 1]?.focus()
    }
}

function onBackspace(i, e) {
    if (!digits.value[i] && i > 0) {
        e.preventDefault()
        boxes.value[i - 1]?.focus()
    }
}

function verify() {
    error.value = digits.value.join('').length === 6 ? '' : 'Enter all 6 digits.'
    if (error.value) {
        return
    }
    busy.value = true
    setTimeout(() => {
        busy.value = false
        done.value = true
    }, 600)
}
</script>
