<template>
    <div>
        <DemoStage title="Live cart">
            <div class="grid lg:grid-cols-3 gap-3">
                <s-card title="Your cart (3)" class="lg:col-span-2">
                    <div v-for="item in cart" :key="item.id" class="flex items-center gap-3 py-3 border-b s-border-theme last:border-0">
                        <span class="w-11 h-11 rounded-lg s-bg-surface-raised flex items-center justify-center flex-shrink-0"><ShoppingBag class="w-5 h-5 s-text-muted" /></span>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium s-text-primary truncate">{{ item.name }}</p>
                            <p class="text-xs s-text-muted">₹{{ item.price.toLocaleString('en-IN') }} each</p>
                        </div>
                        <s-number-input v-model="item.qty" :min="0" :max="9" wrapper="inline" @change="prune(item)" />
                        <p class="text-sm font-semibold s-text-primary w-20 text-right">₹{{ (item.price * item.qty).toLocaleString('en-IN') }}</p>
                    </div>
                    <s-alert v-if="!cart.length" variant="info" title="Cart is empty">Add something delightful first.</s-alert>
                </s-card>
                <s-card title="Summary">
                    <div class="space-y-1.5 text-sm">
                        <p class="flex justify-between s-text-secondary"><span>Subtotal</span><span class="s-text-primary font-medium">₹{{ subtotal.toLocaleString('en-IN') }}</span></p>
                        <p v-if="discount" class="flex justify-between s-text-success"><span>Coupon MONSOON10</span><span class="font-medium">−₹{{ discount.toLocaleString('en-IN') }}</span></p>
                        <p class="flex justify-between s-text-secondary"><span>Delivery</span><span class="s-text-success font-medium">Free</span></p>
                        <p class="flex justify-between s-text-secondary"><span>Tax (18%)</span><span class="s-text-primary font-medium">₹{{ tax.toLocaleString('en-IN') }}</span></p>
                    </div>
                    <div class="border-t s-border-theme mt-3 pt-3 flex justify-between items-center">
                        <span class="text-sm font-semibold s-text-primary">Total</span>
                        <span class="text-lg font-bold s-text-primary">₹{{ total.toLocaleString('en-IN') }}</span>
                    </div>
                    <s-input v-model="coupon" placeholder="Coupon code (try MONSOON10)" inline class="mt-3" />
                    <s-button class="w-full mt-2" variant="secondary" @click="applyCoupon">Apply coupon</s-button>
                    <s-button class="w-full mt-2" :disabled="!cart.length" @click="placed = true">Place order</s-button>
                    <s-alert v-if="placed" variant="success" title="Order placed" class="mt-3">Confirmation sent to your email.</s-alert>
                </s-card>
            </div>
        </DemoStage>
        <DemoSource file="DemoCart.vue" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ShoppingBag } from 'lucide-vue-next'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SCard } from '@kundancool/simple-ui'
import { SNumberInput } from '@kundancool/simple-ui'
import { SInput } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'
import { SAlert } from '@kundancool/simple-ui'

const cart = ref([
    { id: 1, name: 'Deluxe room — 2 nights', price: 8400, qty: 1 },
    { id: 2, name: 'Airport transfer', price: 1200, qty: 2 },
    { id: 3, name: 'Spa voucher', price: 2500, qty: 1 },
])
const coupon = ref('')
const couponError = ref('')
const placed = ref(false)
const discountRate = ref(0)

const subtotal = computed(() => cart.value.reduce((s, i) => s + i.price * i.qty, 0))
const discount = computed(() => Math.round(subtotal.value * discountRate.value))
const tax = computed(() => Math.round((subtotal.value - discount.value) * 0.18))
const total = computed(() => subtotal.value - discount.value + tax.value)

function applyCoupon() {
    if (coupon.value.trim().toUpperCase() === 'MONSOON10') {
        discountRate.value = 0.1
        couponError.value = ''
    } else {
        discountRate.value = 0
        couponError.value = 'Unknown coupon code.'
    }
}

function prune(item) {
    if (item.qty <= 0) {
        cart.value = cart.value.filter((i) => i !== item)
    }
}
</script>
