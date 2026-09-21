<template>
    <div>
        <DemoStage title="Live sign-in form" max-height="80vh">
        <s-auth-layout title="Acme Stays" subtitle="Property admin console">
            <s-card>
                <s-tabs v-model="mode" :tabs="[{ key: 'login', label: 'Sign in' }, { key: 'register', label: 'Register' }]" />
                <div class="mt-4">
                    <s-input v-model="name" label="Property name" placeholder="Seaside Villa" v-if="mode === 'register'" />
                    <s-input v-model="email" label="Email" placeholder="you@acme.test" :error="emailError" />
                    <s-input v-model="password" label="Password" type="password" placeholder="••••••••" :error="passwordError" hint="Minimum 8 characters." />
                    <s-checkbox v-model="remember" label="Keep me signed in" v-if="mode === 'login'" />
                    <s-button class="w-full mt-1" :loading="busy" @click="submit">{{ mode === 'login' ? 'Sign in' : 'Create account' }}</s-button>
                    <s-alert v-if="done" variant="success" :title="mode === 'login' ? 'Welcome back' : 'Account created'" class="mt-3">This is a demo — no request leaves the browser.</s-alert>
                </div>
            </s-card>
            <p class="text-center text-xs s-text-muted mt-4">Protected by rate limiting and audit logging in production.</p>
        </s-auth-layout>
        </DemoStage>
        <DemoSource file="DemoLogin.vue" />
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { SAuthLayout } from '@kundancool/simple-ui'
import { SCard } from '@kundancool/simple-ui'
import { STabs } from '@kundancool/simple-ui'
import { SInput } from '@kundancool/simple-ui'
import { SCheckbox } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'
import { SAlert } from '@kundancool/simple-ui'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'

const mode = ref('login')
const name = ref('')
const email = ref('')
const password = ref('')
const remember = ref(true)
const busy = ref(false)
const done = ref(false)
const emailError = ref('')
const passwordError = ref('')

function submit() {
    emailError.value = /.+@.+\..+/.test(email.value) ? '' : 'Enter a valid email address.'
    passwordError.value = password.value.length >= 8 ? '' : 'Password needs at least 8 characters.'
    if (emailError.value || passwordError.value) {
        return
    }
    busy.value = true
    done.value = false
    setTimeout(() => {
        busy.value = false
        done.value = true
    }, 800)
}
</script>
