<template>
    <div>
        <DemoStage title="Live notification center">
            <s-page-header class="mb-5" title="Notifications" subtitle="Mentions, alerts and updates in one place.">
                <s-badge :value="unreadCount" :hidden="unreadCount === 0">
                    <s-button size="sm" variant="ghost" @click="readAll">Mark all read</s-button>
                </s-badge>
            </s-page-header>
            <s-tabs v-model="tab" :tabs="tabs" />
            <s-card class="mt-3">
                <div v-for="n in visible" :key="n.id" class="flex gap-3 py-3 border-b s-border-theme last:border-0" :class="n.unread ? '' : 'opacity-70'">
                    <span class="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" :class="n.unread ? 's-bg-accent' : 's-bg-border-theme'" />
                    <component :is="n.icon" class="w-8 h-8 rounded-lg s-bg-surface-raised p-1.5 s-text-secondary flex-shrink-0" />
                    <div class="flex-1 min-w-0">
                        <p class="text-sm s-text-primary">{{ n.text }}</p>
                        <p class="text-xs s-text-muted mt-0.5"><s-relative-time :value="n.at" /></p>
                    </div>
                    <s-button v-if="n.unread" size="xs" variant="ghost" @click="n.unread = false">Mark read</s-button>
                </div>
                <s-empty v-if="!visible.length" title="All caught up" description="Nothing in this view." />
            </s-card>
        </DemoStage>
        <DemoSource file="DemoNotifications.vue" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Star, AlertTriangle, UserPlus, CreditCard } from 'lucide-vue-next'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SPageHeader } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'
import { SBadge } from '@kundancool/simple-ui'
import { STabs } from '@kundancool/simple-ui'
import { SCard } from '@kundancool/simple-ui'
import { SRelativeTime } from '@kundancool/simple-ui'
import { SEmpty } from '@kundancool/simple-ui'

const now = Date.now()
const items = ref([
    { id: 1, cat: 'reviews', icon: Star, text: 'New 5★ review from Kabir Singh', at: now - 1000 * 60 * 6, unread: true },
    { id: 2, cat: 'alerts', icon: AlertTriangle, text: 'Item 204 conflicting for tonight', at: now - 1000 * 60 * 44, unread: true },
    { id: 3, cat: 'team', icon: UserPlus, text: 'Rahul Das accepted the front-desk invite', at: now - 1000 * 60 * 60 * 2, unread: true },
    { id: 4, cat: 'billing', icon: CreditCard, text: 'September invoice of ₹1,249 is due', at: now - 1000 * 60 * 60 * 9, unread: false },
])
const unreadCount = computed(() => items.value.filter((i) => i.unread).length)
const tab = ref('all')
const tabs = [
    { key: 'all', label: 'All', count: 4 },
    { key: 'unread', label: 'Unread', count: 3 },
    { key: 'billing', label: 'Billing' },
]

const visible = computed(() => {
    if (tab.value === 'unread') {
        return items.value.filter((i) => i.unread)
    }
    if (tab.value === 'billing') {
        return items.value.filter((i) => i.cat === 'billing')
    }
    return items.value
})

function readAll() {
    items.value.forEach((i) => {
        i.unread = false
    })
}
</script>
