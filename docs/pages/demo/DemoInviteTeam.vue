<template>
    <div>
        <DemoStage title="Live team invite">
            <s-auth-layout title="Acme Stays" subtitle="You've been invited to join">
                <s-card>
                    <div class="flex items-center gap-3">
                        <s-avatar name="Priya K" tone="purple" size="lg" />
                        <div class="min-w-0">
                            <p class="text-sm font-semibold s-text-primary truncate">Priya invited you as Manager</p>
                            <p class="text-xs s-text-muted">priya@acme.test · expires in 6 days</p>
                        </div>
                    </div>
                    <s-input v-model="name" label="Your name" placeholder="Full name" class="mt-4" :error="nameError" />
                    <s-input v-model="password" label="Set a password" type="password" :error="passwordError" />
                    <div class="flex gap-2">
                        <s-button variant="secondary" class="flex-1" @click="declined = true">Decline</s-button>
                        <s-button class="flex-1" :loading="busy" @click="accept">Accept invite</s-button>
                    </div>
                    <s-alert v-if="done" variant="success" title="Welcome aboard" class="mt-3">Your account is ready.</s-alert>
                    <s-alert v-if="declined" variant="info" class="mt-3">Invite declined — Priya has been notified.</s-alert>
                </s-card>
            </s-auth-layout>
        </DemoStage>
        <DemoSource file="DemoInviteTeam.vue" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SAuthLayout } from '@kundancool/simple-ui'
import { SCard } from '@kundancool/simple-ui'
import { SInput } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'
import { SAlert } from '@kundancool/simple-ui'
import { SAvatar } from '@kundancool/simple-ui'

const name = ref('')
const password = ref('')
const busy = ref(false)
const done = ref(false)
const declined = ref(false)
const nameError = ref('')
const passwordError = ref('')

function accept() {
    nameError.value = name.value.trim() ? '' : 'Name is required.'
    passwordError.value = password.value.length >= 8 ? '' : 'Minimum 8 characters.'
    if (nameError.value || passwordError.value) {
        return
    }
    busy.value = true
    setTimeout(() => {
        busy.value = false
        done.value = true
    }, 700)
}
</script>
