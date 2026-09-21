<template>
    <div>
        <DemoStage title="Live onboarding checklist">
            <div class="max-w-xl mx-auto">
                <div class="text-center">
                    <h1 class="text-xl font-bold s-text-primary">Get Acme Stays live</h1>
                    <p class="text-sm s-text-muted mt-1">{{ doneCount }} of {{ steps.length }} complete</p>
                    <s-progress :value="(doneCount / steps.length) * 100" tone="success" class="mt-3" />
                </div>
                <div class="mt-4 space-y-2">
                    <button
                        v-for="s in steps"
                        :key="s.title"
                        type="button"
                        class="s-focus-ring w-full text-left border rounded-xl p-3 transition-colors"
                        :class="s.done ? 's-border-success s-bg-success-subtle' : 's-border-theme s-bg-surface'"
                        @click="s.done = !s.done"
                    >
                        <span class="flex items-center gap-2.5">
                            <span class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" :class="s.done ? 's-bg-success s-text-on-solid' : 's-bg-surface-raised s-text-muted'">
                                <Check v-if="s.done" class="w-3.5 h-3.5" /><span v-else class="text-[11px] font-bold">{{ s.n }}</span>
                            </span>
                            <span>
                                <span class="block text-sm font-medium" :class="s.done ? 's-text-muted line-through' : 's-text-primary'">{{ s.title }}</span>
                                <span class="block text-xs s-text-muted">{{ s.hint }}</span>
                            </span>
                        </span>
                    </button>
                </div>
                <s-alert v-if="doneCount === steps.length" variant="success" title="You're live!" class="mt-4">Bookings can now flow into Acme Stays.</s-alert>
            </div>
        </DemoStage>
        <DemoSource file="DemoOnboarding.vue" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Check } from 'lucide-vue-next'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SAlert } from '@kundancool/simple-ui'
import { SProgress } from '@kundancool/simple-ui'

const steps = ref([
    { n: 1, title: 'Add your first property', hint: 'Name, address and 3 photos minimum.', done: true },
    { n: 2, title: 'Create room types', hint: 'Deluxe, Suite… with nightly rates.', done: true },
    { n: 3, title: 'Connect a channel', hint: 'MMT, Booking.com or Goibibo.', done: false },
    { n: 4, title: 'Invite your team', hint: 'Front desk gets in free.', done: false },
])
const doneCount = computed(() => steps.value.filter((s) => s.done).length)
</script>
