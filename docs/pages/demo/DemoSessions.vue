<template>
    <div>
        <DemoStage title="Live sessions">
            <s-page-header title="Sessions & devices" subtitle="Revoke anything you don't recognise." />
            <s-card>
                <div v-for="s in sessions" :key="s.id" class="flex items-center gap-3 py-3 border-b s-border-theme last:border-0">
                    <span class="w-9 h-9 rounded-lg s-bg-surface-raised flex items-center justify-center flex-shrink-0"><MonitorSmartphone class="w-4 h-4 s-text-muted" /></span>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium s-text-primary truncate">{{ s.device }} <s-tag v-if="s.current" type="success" size="sm">This device</s-tag></p>
                        <p class="text-xs s-text-muted">{{ s.location }} · <s-relative-time :value="s.seen" /></p>
                    </div>
                    <s-button v-if="!s.current" size="sm" variant="secondary" @click="revoke(s)">Revoke</s-button>
                </div>
            </s-card>
        </DemoStage>
        <DemoSource file="DemoSessions.vue" />
        <s-toast-container />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { MonitorSmartphone } from 'lucide-vue-next'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SPageHeader } from '@kundancool/simple-ui'
import { SCard } from '@kundancool/simple-ui'
import { STag } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'
import { SRelativeTime } from '@kundancool/simple-ui'
import { SToastContainer } from '@kundancool/simple-ui'
import { useToast } from '@kundancool/simple-ui'

const { success } = useToast()
const now = Date.now()
const sessions = ref([
    { id: 1, device: 'MacBook Pro · Chrome', location: 'Bengaluru, IN', seen: now - 1000 * 60 * 2, current: true },
    { id: 2, device: 'iPhone 15 · App', location: 'Bengaluru, IN', seen: now - 1000 * 60 * 60 * 5 },
    { id: 3, device: 'Windows · Edge', location: 'Mumbai, IN', seen: now - 1000 * 60 * 60 * 30 },
])

function revoke(s) {
    sessions.value = sessions.value.filter((x) => x !== s)
    success(`${s.device} signed out.`)
}
</script>
