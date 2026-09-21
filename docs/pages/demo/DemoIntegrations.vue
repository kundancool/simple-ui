<template>
    <div>
        <DemoStage title="Live integrations">
            <s-page-header title="Integrations" subtitle="Connect the tools around your workspaces." />
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <s-card v-for="app in apps" :key="app.name">
                    <div class="flex items-center gap-2.5">
                        <span class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" :class="app.bg"><component :is="app.icon" class="w-4 h-4" :class="app.fg" /></span>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-semibold s-text-primary truncate">{{ app.name }}</p>
                            <p class="text-xs s-text-muted truncate">{{ app.blurb }}</p>
                        </div>
                        <s-switch v-model="app.on" :aria-label="app.name" @change="toggled(app)" />
                    </div>
                </s-card>
            </div>
        </DemoStage>
        <DemoSource file="DemoIntegrations.vue" />
        <s-toast-container />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { MessageSquare, CreditCard, Mail, BarChart3, CalendarDays, Webhook } from 'lucide-vue-next'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SPageHeader } from '@kundancool/simple-ui'
import { SCard } from '@kundancool/simple-ui'
import { SSwitch } from '@kundancool/simple-ui'
import { SToastContainer } from '@kundancool/simple-ui'
import { useToast } from '@kundancool/simple-ui'

const { success } = useToast()
const apps = ref([
    { name: 'Slack alerts', blurb: 'Conflicts pings', icon: MessageSquare, bg: 's-bg-icon-purple', fg: 's-text-icon-purple', on: true },
    { name: 'Razorpay', blurb: 'Card + UPI collection', icon: CreditCard, bg: 's-bg-icon-blue', fg: 's-text-icon-blue', on: true },
    { name: 'Mailgun', blurb: 'Customer emails', icon: Mail, bg: 's-bg-icon-yellow', fg: 's-text-icon-yellow', on: false },
    { name: 'Metabase', blurb: 'Custom dashboards', icon: BarChart3, bg: 's-bg-icon-green', fg: 's-text-icon-green', on: false },
    { name: 'Google Calendar', blurb: 'Two-way block sync', icon: CalendarDays, bg: 's-bg-icon-orange', fg: 's-text-icon-orange', on: false },
    { name: 'Custom webhooks', blurb: 'Your own endpoints', icon: Webhook, bg: 's-bg-icon-blue', fg: 's-text-icon-blue', on: true },
])

function toggled(app) {
    success(`${app.name} ${app.on ? 'connected' : 'disconnected'}.`)
}
</script>
