<template>
    <div>
        <DemoStage title="Live settings page">
        <s-page-header title="Settings" subtitle="Workspace preferences for Acme Stays." />
        <s-tabs v-model="tab" :tabs="[{ key: 'profile', label: 'Profile' }, { key: 'prefs', label: 'Preferences' }, { key: 'danger', label: 'Danger zone' }]" />
        <div class="mt-4">
            <s-card v-if="tab === 'profile'" title="Profile">
                <div class="grid sm:grid-cols-2 gap-x-4">
                    <s-input v-model="name" label="Display name" />
                    <s-input v-model="email" label="Email" :error="emailError" />
                </div>
                <s-select v-model="tz" label="Timezone" :options="zones" option-label="label" option-value="value" />
                <s-button :loading="saving" @click="saveProfile">Save changes</s-button>
            </s-card>
            <s-card v-if="tab === 'prefs'" title="Preferences">
                <div class="divide-y s-divide-subtle">
                    <label v-for="p in prefs" :key="p.key" class="flex items-center gap-3 py-3">
                        <s-switch v-model="p.on" :aria-label="p.label" />
                        <span><span class="block text-sm s-text-primary">{{ p.label }}</span><span class="block text-xs s-text-muted">{{ p.hint }}</span></span>
                    </label>
                </div>
            </s-card>
            <s-card v-if="tab === 'danger'" title="Danger zone">
                <s-alert variant="danger" title="Delete workspace">Removes every property, booking and report. This cannot be undone.</s-alert>
                <s-button variant="danger" class="mt-3" @click="confirm = true">Delete workspace…</s-button>
            </s-card>
        </div>
        <s-confirm-by-name-dialog v-model="confirm" title="Delete workspace" message="All data for Acme Stays will be permanently removed." expected="Acme Stays" label="workspace" confirm-text="Delete everything" @confirm="gone = true" />
        <s-alert v-if="gone" variant="danger" title="Workspace deleted" class="mt-3">Just kidding — demos never delete anything.</s-alert>
        </DemoStage>
        <DemoSource file="DemoSettings.vue" />
        <s-toast-container />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SPageHeader } from '@kundancool/simple-ui'
import { STabs } from '@kundancool/simple-ui'
import { SCard } from '@kundancool/simple-ui'
import { SInput } from '@kundancool/simple-ui'
import { SSelect } from '@kundancool/simple-ui'
import { SSwitch } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'
import { SAlert } from '@kundancool/simple-ui'
import { SConfirmByNameDialog } from '@kundancool/simple-ui'
import { SToastContainer } from '@kundancool/simple-ui'
import { useToast } from '@kundancool/simple-ui'

const { success } = useToast()
const tab = ref('profile')
const name = ref('Kundan Kumar')
const email = ref('kundan@acme.test')
const emailError = ref('')
const tz = ref('IST')
const saving = ref(false)
const confirm = ref(false)
const gone = ref(false)

const zones = [
    { value: 'IST', label: 'IST (UTC+5:30)' },
    { value: 'UTC', label: 'UTC' },
    { value: 'EST', label: 'EST (UTC−5)' },
]
const prefs = ref([
    { key: 'digest', label: 'Daily digest', hint: 'Occupancy summary every morning.', on: true },
    { key: 'alerts', label: 'Overbooking alerts', hint: 'Instant notification on conflicts.', on: true },
    { key: 'marketing', label: 'Product updates', hint: 'Occasional feature announcements.', on: false },
])

function saveProfile() {
    emailError.value = /.+@.+\..+/.test(email.value) ? '' : 'Enter a valid email.'
    if (emailError.value) {
        return
    }
    saving.value = true
    setTimeout(() => {
        saving.value = false
        success('Settings saved.')
    }, 600)
}
</script>
