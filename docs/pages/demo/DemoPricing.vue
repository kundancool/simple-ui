<template>
    <div>
        <DemoStage title="Live pricing page">
        <div class="text-center max-w-xl mx-auto">
            <h1 class="text-2xl md:text-3xl font-bold s-text-primary tracking-tight">Simple pricing, no surprises</h1>
            <p class="text-sm s-text-muted mt-2">Start free. Upgrade when your workspaces grow.</p>
            <div class="mt-4">
                <s-segmented v-model="billing" :options="[{ label: 'Monthly', value: 'Monthly' }, { label: 'Yearly', value: 'Yearly' }]" aria-label="Billing cycle" />
            </div>
            <p v-if="billing === 'Yearly'" class="text-xs s-text-success font-medium mt-2">2 months free on yearly plans</p>
        </div>

        <div class="grid md:grid-cols-3 gap-4 mt-6 items-stretch">
            <s-card v-for="plan in plans" :key="plan.name" :class="['s-price-card', plan.popular ? 's-plan-popular' : '']">
                <template #header>
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-semibold s-text-primary">{{ plan.name }}</span>
                        <s-tag v-if="plan.popular" type="success" size="sm">Most popular</s-tag>
                    </div>
                </template>
                <p class="mt-1"><span class="text-3xl font-bold s-text-primary">₹{{ price(plan) }}</span><span class="text-sm s-text-muted">/mo</span></p>
                <p class="text-sm s-text-secondary mt-1">{{ plan.blurb }}</p>
                <ul class="mt-4 space-y-2">
                    <li v-for="f in plan.features" :key="f" class="flex items-start gap-2 text-sm s-text-secondary">
                        <Check class="w-4 h-4 s-text-success flex-shrink-0 mt-0.5" />{{ f }}
                    </li>
                </ul>
                <s-button class="w-full mt-5" :variant="plan.popular ? 'primary' : 'secondary'" @click="choose(plan)">Choose {{ plan.name }}</s-button>
                <template #footer>
                    <p class="text-xs s-text-muted text-center">{{ plan.footnote }}</p>
                </template>
            </s-card>
        </div>
        </DemoStage>
        <DemoSource file="DemoPricing.vue" />
        <s-toast-container />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Check } from 'lucide-vue-next'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SCard } from '@kundancool/simple-ui'
import { STag } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'
import { SSegmented } from '@kundancool/simple-ui'
import { SToastContainer } from '@kundancool/simple-ui'
import { useToast } from '@kundancool/simple-ui'

const { success } = useToast()
const billing = ref('Monthly')

const plans = [
    { name: 'Starter', monthly: 0, yearly: 0, blurb: 'For a single workspace finding its feet.', features: ['1 workspace', '50 orders / month', 'Email support'], footnote: 'Free forever' },
    { name: 'Growth', monthly: 1499, yearly: 1249, blurb: 'For growing portfolios that live in reports.', features: ['Up to 10 workspaces', 'Unlimited orders', 'Marketplace sync', 'Priority support'], footnote: 'Cancel anytime', popular: true },
    { name: 'Scale', monthly: 4999, yearly: 4169, blurb: 'For chains with custom needs.', features: ['Unlimited workspaces', 'API access', 'Dedicated manager', 'SLA + onboarding'], footnote: 'Annual billing available' },
]

function price(plan) {
    return (billing.value === 'Yearly' ? plan.yearly : plan.monthly).toLocaleString('en-IN')
}

function choose(plan) {
    success(`${plan.name} plan selected (${billing.value.toLowerCase()} billing).`)
}
</script>

<style>
.s-plan-popular {
    border-color: var(--s-accent-border);
    box-shadow: 0 0 0 1px var(--s-accent-border), var(--s-shadow-md);
}
.s-price-card {
    display: flex;
    flex-direction: column;
    height: 100%;
}
.s-price-card > div:last-child {
    margin-top: auto;
}
</style>
