<template>
    <div class="border s-border-theme rounded-xl overflow-hidden">
        <s-page-header title="Bookings" subtitle="Sample header — actions emit events" add-text="New booking" refreshable :loading="loading" @add="flash('add')" @refresh="reload" />
        <p v-if="message" class="px-1 pb-1 text-sm s-text-success">{{ message }}</p>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { SPageHeader } from '@kundancool/simple-ui'

const loading = ref(false)
const message = ref('')

function flash(what) {
    message.value = `${what} clicked.`
}

function reload() {
    loading.value = true
    message.value = ''
    setTimeout(() => {
        loading.value = false
        message.value = 'Reloaded.'
    }, 600)
}
</script>
