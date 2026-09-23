<template>
    <div>
        <DemoStage title="Live webhooks">
            <s-page-header class="mb-5" title="Webhooks" subtitle="Event deliveries and endpoint health." add-text="New endpoint" @add="notify('Endpoint form opening (demo).')" />
            <s-card>
                <div v-for="hook in hooks" :key="hook.id" class="py-3 border-b s-border-theme last:border-0">
                    <div class="flex items-center gap-3">
                        <s-switch v-model="hook.on" :aria-label="hook.url" />
                        <div class="flex-1 min-w-0">
                            <p class="font-mono text-xs s-text-primary truncate">{{ hook.url }}</p>
                            <p class="text-xs s-text-muted mt-0.5">{{ hook.events.join(' · ') }}</p>
                        </div>
                        <s-tag :type="hook.failing ? 'danger' : 'success'" size="sm">{{ hook.failing ? `${hook.fails}/5 failing` : 'Healthy' }}</s-tag>
                        <s-button size="sm" variant="secondary" @click="ping(hook)">Send test</s-button>
                    </div>
                    <div class="flex gap-1 mt-2 ml-12">
                        <span v-for="(ok, i) in hook.history" :key="i" class="w-6 h-1.5 rounded-full" :class="ok ? 's-bg-success' : 's-bg-danger'" :title="ok ? 'Delivered' : 'Failed'" />
                    </div>
                </div>
            </s-card>
        </DemoStage>
        <DemoSource file="DemoWebhooks.vue" />
        <s-toast-container />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SPageHeader } from '@kundancool/simple-ui'
import { SCard } from '@kundancool/simple-ui'
import { SSwitch } from '@kundancool/simple-ui'
import { STag } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'
import { SToastContainer } from '@kundancool/simple-ui'
import { useToast } from '@kundancool/simple-ui'

const { success } = useToast()
const hooks = ref([
    { id: 1, url: 'https://acme.test/hooks/orders', events: ['order.created', 'order.cancelled'], on: true, failing: false, history: [1, 1, 1, 1, 1, 1, 1, 1] },
    { id: 2, url: 'https://acme.test/hooks/payments', events: ['payment.received'], on: true, failing: true, fails: 3, history: [1, 1, 0, 1, 0, 1, 0, 1] },
])

function ping(hook) {
    hook.history.push(1)
    hook.history.shift()
    hook.failing = false
    success(`Test event delivered to ${hook.url}.`)
}

function notify(message) {
    success(message)
}
</script>
