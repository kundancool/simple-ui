<template>
    <div>
        <DemoStage title="Live checkout">
            <div class="grid lg:grid-cols-3 gap-3">
                <s-card title="Payment" class="lg:col-span-2">
                    <s-tabs v-model="method" :tabs="[{ key: 'card', label: 'Card' }, { key: 'upi', label: 'UPI' }]" />
                    <div class="mt-4 space-y-4">
                        <template v-if="method === 'card'">
                            <s-input v-model="card" label="Card number" placeholder="4111 1111 1111 1111" :error="cardError" />
                            <div class="grid grid-cols-2 gap-x-4">
                                <s-input v-model="expiry" label="Expiry" placeholder="MM / YY" />
                                <s-input v-model="cvv" label="CVV" placeholder="123" />
                            </div>
                        </template>
                        <s-input v-else v-model="upi" label="UPI ID" placeholder="name@bank" :error="upiError" />
                        <s-checkbox v-model="save" label="Save this method for next time" />
                    </div>
                </s-card>
                <s-card title="Order">
                    <p class="flex justify-between text-sm s-text-secondary"><span>2 days + extras</span><span class="s-text-primary font-medium">₹14,278</span></p>
                    <p class="flex justify-between text-sm font-bold s-text-primary mt-2 pt-2 border-t s-border-theme"><span>Due today</span><span>₹14,278</span></p>
                    <s-button class="w-full mt-3" :loading="paying" @click="pay">Pay ₹14,278</s-button>
                    <s-alert v-if="done" variant="success" title="Payment successful" class="mt-3">Order ORD-105 is confirmed.</s-alert>
                </s-card>
            </div>
        </DemoStage>
        <DemoSource file="DemoCheckout.vue" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SCard } from '@kundancool/simple-ui'
import { STabs } from '@kundancool/simple-ui'
import { SInput } from '@kundancool/simple-ui'
import { SCheckbox } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'
import { SAlert } from '@kundancool/simple-ui'

const method = ref('card')
const card = ref('')
const expiry = ref('')
const cvv = ref('')
const upi = ref('')
const save = ref(true)
const paying = ref(false)
const done = ref(false)
const cardError = ref('')
const upiError = ref('')

function pay() {
    if (method.value === 'card') {
        cardError.value = card.value.replace(/\s/g, '').length >= 12 ? '' : 'Enter a valid card number.'
        if (cardError.value) {
            return
        }
    } else {
        upiError.value = /.+@.+/.test(upi.value) ? '' : 'Enter a valid UPI ID.'
        if (upiError.value) {
            return
        }
    }
    paying.value = true
    setTimeout(() => {
        paying.value = false
        done.value = true
    }, 900)
}
</script>
