<template>
    <div>
        <DemoStage title="Live testimonials wall">
            <div class="text-center max-w-xl mx-auto">
                <div class="inline-flex items-center gap-2">
                    <s-rating :model-value="5" readonly />
                    <span class="text-sm font-bold s-text-primary ml-1">4.8 / 5</span>
                </div>
                <h1 class="text-xl font-bold s-text-primary mt-2">Loved by workspaces everywhere</h1>
                <p class="text-sm s-text-muted mt-1">2,400+ verified customer reviews this year.</p>
            </div>
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                <s-card v-for="t in shown" :key="t.name">
                    <s-rating :model-value="t.stars" readonly size="sm" />
                    <p class="text-sm s-text-primary mt-2">“{{ t.text }}”</p>
                    <div class="flex items-center gap-2 mt-3">
                        <s-avatar :name="t.name" size="sm" />
                        <div><p class="text-xs font-semibold s-text-primary">{{ t.name }}</p><p class="text-[11px] s-text-muted">{{ t.meta }}</p></div>
                    </div>
                </s-card>
            </div>
            <div class="text-center mt-4">
                <s-button variant="secondary" @click="showAll = !showAll">{{ showAll ? 'Show less' : `Show all ${reviews.length} reviews` }}</s-button>
            </div>
        </DemoStage>
        <DemoSource file="DemoTestimonials.vue" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SCard } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'
import { SRating } from '@kundancool/simple-ui'
import { SAvatar } from '@kundancool/simple-ui'

const reviews = [
    { name: 'Aarav Sharma', initials: 'AS', meta: 'Customer since August', stars: 5, text: 'Setup took two minutes and the dashboard looked great.' },
    { name: 'Diya Patel', initials: 'DP', meta: 'Customer since July', stars: 5, text: 'The team remembered our rollout date. Lovely touch.' },
    { name: 'Kabir Singh', initials: 'KS', meta: 'Customer since August', stars: 4, text: 'Great product. Onboarding was a bit long on day one.' },
    { name: 'Meera Iyer', initials: 'MI', meta: 'Customer since June', stars: 5, text: 'Fast support, clear docs, perfect for our team.' },
    { name: 'Rohan Verma', initials: 'RV', meta: 'Customer since September', stars: 5, text: 'Migrations were handled even at midnight.' },
    { name: 'Sara Khan', initials: 'SK', meta: 'Customer since May', stars: 4, text: 'Beautiful dashboard. Exports could be a touch faster.' },
]
const showAll = ref(false)
const shown = computed(() => (showAll.value ? reviews : reviews.slice(0, 3)))
</script>
