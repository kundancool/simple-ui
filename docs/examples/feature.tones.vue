<!-- demo: Every icon tone — All five icon colors on the same feature. -->
<template>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <s-feature :icon="WalletIcon" title="Billing" description="Plans and invoices." tone="blue" />
        <s-feature :icon="WalletIcon" title="Billing" description="Plans and invoices." tone="green" />
        <s-feature :icon="WalletIcon" title="Billing" description="Plans and invoices." tone="yellow" />
        <s-feature :icon="WalletIcon" title="Billing" description="Plans and invoices." tone="purple" />
        <s-feature :icon="WalletIcon" title="Billing" description="Plans and invoices." tone="orange" />
    </div>
</template>

<script setup>
import { Wallet } from 'lucide-vue-next'
import { SFeature } from '@kundancool/simple-ui'

const WalletIcon = Wallet
</script>
