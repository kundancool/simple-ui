<template>
    <div class="border s-border-theme rounded-xl overflow-hidden">
        <s-auth-layout title="Acme Inc" subtitle="Sign in to continue">
            <s-card>
                <s-input v-model="email" label="Email" placeholder="you@acme.test" />
                <s-input v-model="password" label="Password" type="password" placeholder="••••••••" />
                <s-button class="w-full">Sign in</s-button>
            </s-card>
        </s-auth-layout>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { SAuthLayout } from '@kundancool/simple-ui'
import { SCard } from '@kundancool/simple-ui'
import { SInput } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'

const email = ref('')
const password = ref('')
</script>
