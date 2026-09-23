<template>
    <s-carousel height="220px" :interval="5000">
        <div class="w-full h-full flex flex-col items-center justify-center s-bg-accent-subtle">
            <p class="text-lg font-bold s-text-primary">Spring sale</p>
            <p class="text-sm s-text-secondary">20% off annual plans this month</p>
        </div>
        <div class="w-full h-full flex flex-col items-center justify-center s-bg-surface-raised">
            <p class="text-lg font-bold s-text-primary">New: priority delivery</p>
            <p class="text-sm s-text-secondary">Flat ₹199, any address</p>
        </div>
        <div class="w-full h-full flex flex-col items-center justify-center s-bg-accent-subtle">
            <p class="text-lg font-bold s-text-primary">4.8 rated by 2,400 customers</p>
            <p class="text-sm s-text-secondary">Thank you for your feedback</p>
        </div>
    </s-carousel>
</template>

<script setup>
import { SCarousel } from '@kundancool/simple-ui'
</script>
