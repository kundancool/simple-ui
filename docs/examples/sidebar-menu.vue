<template>
    <div class="border s-border-theme rounded-xl overflow-hidden">
        <div class="s-bg-sidebar px-3 py-2 border-b s-border-theme flex items-center gap-2">
            <LayoutDashboard class="w-4 h-4 s-text-accent" />
            <span class="text-sm font-semibold s-text-primary">Live menu preview</span>
        </div>
        <div class="h-64 overflow-hidden">
            <s-sidebar-menu :items="items" :active-path="active" @navigate="go" />
        </div>
    </div>
    <p class="text-sm s-text-muted mt-2">Active: <span class="font-mono text-[12px]">{{ active }}</span> (click to navigate)</p>
</template>

<script setup>
import { ref } from 'vue'
import { LayoutDashboard, CalendarCheck, Wallet, Settings } from 'lucide-vue-next'
import { SSidebarMenu } from '@kundancool/simple-ui'

const active = ref('/orders')
const items = [
    { name: 'dash', label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    {
        name: 'sales',
        label: 'Sales',
        icon: Wallet,
        children: [
            { name: 'orders', label: 'Orders', to: '/orders', icon: CalendarCheck },
            { name: 'settings', label: 'Settings', to: '/settings', icon: Settings },
        ],
    },
]

function go(item) {
    if (item.to) {
        active.value = item.to
    }
}
</script>
