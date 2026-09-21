<template>
    <div class="grid sm:grid-cols-2 gap-3">
        <s-feature :icon="WalletIcon" title="Billing" description="Plans, cards and invoices in one place." tone="green" link-label="Open billing" />
        <s-feature :icon="ShieldIcon" title="Roles" description="Granular access per role." tone="purple" />
    </div>
</template>

<script setup>
import { Wallet, ShieldCheck } from 'lucide-vue-next'
import { SFeature } from '@kundancool/simple-ui'

const WalletIcon = Wallet
const ShieldIcon = ShieldCheck
</script>
