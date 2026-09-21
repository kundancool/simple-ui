<template>
    <div>
        <DemoStage title="Live testimonials wall">
            <div class="text-center max-w-xl mx-auto">
                <div class="inline-flex items-center gap-2">
                    <s-rating :model-value="5" readonly />
                    <span class="text-sm font-bold s-text-primary ml-1">4.8 / 5</span>
                </div>
                <h1 class="text-xl font-bold s-text-primary mt-2">Loved by properties everywhere</h1>
                <p class="text-sm s-text-muted mt-1">2,400+ verified guest reviews this year.</p>
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
    { name: 'Aarav Sharma', initials: 'AS', meta: 'Stayed in August', stars: 5, text: 'Check-in took two minutes and the room was spotless.' },
    { name: 'Diya Patel', initials: 'DP', meta: 'Stayed in July', stars: 5, text: 'The staff remembered our anniversary. Lovely touch.' },
    { name: 'Kabir Singh', initials: 'KS', meta: 'Stayed in August', stars: 4, text: 'Great location. Breakfast queue was a bit long on Sunday.' },
    { name: 'Meera Iyer', initials: 'MI', meta: 'Stayed in June', stars: 5, text: 'Silent AC, fast Wi-Fi, perfect workcation setup.' },
    { name: 'Rohan Verma', initials: 'RV', meta: 'Stayed in September', stars: 5, text: 'Airport pickup was waiting even at midnight.' },
    { name: 'Sara Khan', initials: 'SK', meta: 'Stayed in May', stars: 4, text: 'Beautiful property. Pool closes a touch early.' },
]
const showAll = ref(false)
const shown = computed(() => (showAll.value ? reviews : reviews.slice(0, 3)))
</script>
