<template>
    <div>
        <DemoStage title="Live order wizard">
            <s-steps v-model="step" :steps="[{ key: 'schedule', label: 'Schedule' }, { key: 'product', label: 'Product' }, { key: 'customer', label: 'Customer' }, { key: 'done', label: 'Done' }]">
                <template #schedule>
                    <div class="grid sm:grid-cols-2 gap-x-4 mt-4">
                        <s-date-picker v-model="schedule" range label="Date range" :options="scheduleOptions" />
                        <s-number-input v-model="quantity" label="Quantity" :min="1" :max="6" />
                    </div>
                </template>
                <template #product>
                    <div class="grid sm:grid-cols-3 gap-2 mt-4">
                        <button
                            v-for="p in products"
                            :key="p.name"
                            type="button"
                            class="s-focus-ring border rounded-xl p-3 text-left transition-colors"
                            :class="product === p.name ? 's-border-accent s-bg-accent-subtle' : 's-border-theme s-bg-surface'"
                            @click="product = p.name"
                        >
                            <p class="text-sm font-semibold s-text-primary">{{ p.name }}</p>
                            <p class="text-xs s-text-muted">₹{{ p.price.toLocaleString('en-IN') }} / day</p>
                        </button>
                    </div>
                </template>
                <template #customer>
                    <div class="grid sm:grid-cols-2 gap-x-4 mt-4">
                        <s-input v-model="name" label="Customer name" :error="nameError" />
                        <s-input v-model="phone" label="Phone" placeholder="+91…" />
                    </div>
                </template>
                <template #done>
                    <s-alert variant="success" title="Order confirmed" class="mt-4">{{ name || 'Customer' }} · {{ product }} · {{ schedule.join(' → ') || 'dates TBD' }} · {{ quantity }} item(s).</s-alert>
                </template>
            </s-steps>
            <div class="flex justify-between mt-4">
                <s-button variant="secondary" :disabled="atFirst || atDone" @click="move(-1)">Back</s-button>
                <s-button v-if="!atDone" @click="move(1)">{{ atLast ? 'Confirm order' : 'Continue' }}</s-button>
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
import { SDatePicker } from '@kundancool/simple-ui'
import { SNumberInput } from '@kundancool/simple-ui'
import { SInput } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'
import { SAlert } from '@kundancool/simple-ui'

const steps = ['schedule', 'product', 'customer', 'done']
const step = ref('schedule')
const schedule = ref([])
const scheduleOptions = [
    { label: 'Yesterday', range: ['2026-09-21', '2026-09-21'] },
    { label: 'Last 7 days', range: ['2026-09-15', '2026-09-21'] },
]
const quantity = ref(2)
const product = ref('Basic')
const name = ref('')
const phone = ref('')
const nameError = ref('')

const products = [
    { name: 'Basic', price: 2200 },
    { name: 'Standard', price: 4200 },
    { name: 'Premium', price: 7800 },
]
const atFirst = computed(() => step.value === 'schedule')
const atLast = computed(() => step.value === 'customer')
const atDone = computed(() => step.value === 'done')

function move(delta) {
    if (delta > 0 && step.value === 'customer') {
        nameError.value = name.value.trim() ? '' : 'Customer name is required.'
        if (nameError.value) {
            return
        }
    }
    const i = steps.indexOf(step.value) + delta
    step.value = steps[Math.max(0, Math.min(steps.length - 1, i))]
}
</script>
