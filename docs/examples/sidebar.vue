<template>
    <div class="border s-border-theme rounded-xl overflow-hidden" style="height: 320px">
        <s-sidebar v-model:open="open" :fixed="false" brand-name="Acme" brand-sub="v2.4">
            <s-sidebar-menu :items="items" active-path="/reports" />
            <template #footer>
                <p class="text-[11px] s-text-muted">© 2026 Acme</p>
            </template>
        </s-sidebar>
    </div>
    <div class="mt-2">
        <s-button size="sm" variant="secondary" @click="open = !open">{{ open ? 'Collapse' : 'Expand' }} sidebar</s-button>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { LayoutDashboard, FileText } from 'lucide-vue-next'
import { SSidebar } from '@kundancool/simple-ui'
import { SSidebarMenu } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'

const open = ref(true)
const items = [
    { name: 'dash', label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'reports', label: 'Reports', to: '/reports', icon: FileText },
]
</script>
