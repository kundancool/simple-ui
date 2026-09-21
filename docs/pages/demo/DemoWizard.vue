<template>
    <div>
        <DemoStage title="Live booking wizard">
            <s-steps v-model="step" :steps="[{ key: 'stay', label: 'Stay' }, { key: 'room', label: 'Room' }, { key: 'guest', label: 'Guest' }, { key: 'done', label: 'Done' }]">
                <template #stay>
                    <div class="grid sm:grid-cols-2 gap-x-4 mt-4">
                        <s-date-range-picker v-model="stay" label="Stay dates" />
                        <s-number-input v-model="guests" label="Guests" :min="1" :max="6" />
                    </div>
                </template>
                <template #room>
                    <div class="grid sm:grid-cols-3 gap-2 mt-4">
                        <button
                            v-for="r in rooms"
                            :key="r.name"
                            type="button"
                            class="s-focus-ring border rounded-xl p-3 text-left transition-colors"
                            :class="room === r.name ? 's-border-accent s-bg-accent-subtle' : 's-border-theme s-bg-surface'"
                            @click="room = r.name"
                        >
                            <p class="text-sm font-semibold s-text-primary">{{ r.name }}</p>
                            <p class="text-xs s-text-muted">₹{{ r.price.toLocaleString('en-IN') }} / night</p>
                        </button>
                    </div>
                </template>
                <template #guest>
                    <div class="grid sm:grid-cols-2 gap-x-4 mt-4">
                        <s-input v-model="name" label="Guest name" :error="nameError" />
                        <s-input v-model="phone" label="Phone" placeholder="+91…" />
                    </div>
                </template>
                <template #done>
                    <s-alert variant="success" title="Booking confirmed" class="mt-4">{{ name || 'Guest' }} · {{ room }} · {{ stay.join(' → ') || 'dates TBD' }} · {{ guests }} guest(s).</s-alert>
                </template>
            </s-steps>
            <div class="flex justify-between mt-4">
                <s-button variant="secondary" :disabled="atFirst || atDone" @click="move(-1)">Back</s-button>
                <s-button v-if="!atDone" @click="move(1)">{{ atLast ? 'Confirm booking' : 'Continue' }}</s-button>
            </div>
        </DemoStage>
        <DemoSource file="DemoWizard.vue" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SSteps } from '@kundancool/simple-ui'
import { SDateRangePicker } from '@kundancool/simple-ui'
import { SNumberInput } from '@kundancool/simple-ui'
import { SInput } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'
import { SAlert } from '@kundancool/simple-ui'

const order = ['stay', 'room', 'guest', 'done']
const step = ref('stay')
const stay = ref([])
const guests = ref(2)
const room = ref('Deluxe')
const name = ref('')
const phone = ref('')
const nameError = ref('')

const rooms = [
    { name: 'Standard', price: 2200 },
    { name: 'Deluxe', price: 4200 },
    { name: 'Suite', price: 7800 },
]
const atFirst = computed(() => step.value === 'stay')
const atLast = computed(() => step.value === 'guest')
const atDone = computed(() => step.value === 'done')

function move(delta) {
    if (delta > 0 && step.value === 'guest') {
        nameError.value = name.value.trim() ? '' : 'Guest name is required.'
        if (nameError.value) {
            return
        }
    }
    const i = order.indexOf(step.value) + delta
    step.value = order[Math.max(0, Math.min(order.length - 1, i))]
}
</script>
