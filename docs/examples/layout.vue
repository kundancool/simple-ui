<template>
    <div class="border s-border-theme rounded-xl overflow-hidden">
        <div class="s-bg-sidebar px-3 py-2 border-b s-border-theme">
            <span class="text-sm font-semibold s-text-primary">Shell preview (see code for full usage)</span>
        </div>
        <div class="h-64 overflow-hidden">
            <s-sidebar-menu :items="items" active-path="/reports" />
        </div>
    </div>
</template>

<script setup>
import { LayoutDashboard, Table2 } from 'lucide-vue-next'
import { SSidebarMenu } from '@kundancool/simple-ui'

const items = [
    { name: 'dash', label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'reports', label: 'Reports', to: '/reports', icon: Table2 },
]
</script>
