<template>
    <s-carousel height="220px" :interval="5000">
        <div class="w-full h-full flex flex-col items-center justify-center s-bg-accent-subtle">
            <p class="text-lg font-bold s-text-primary">Monsoon offer</p>
            <p class="text-sm s-text-secondary">20% off suites this month</p>
        </div>
        <div class="w-full h-full flex flex-col items-center justify-center s-bg-surface-raised">
            <p class="text-lg font-bold s-text-primary">New: airport pickup</p>
            <p class="text-sm s-text-secondary">Flat ₹1,200, any hour</p>
        </div>
        <div class="w-full h-full flex flex-col items-center justify-center s-bg-accent-subtle">
            <p class="text-lg font-bold s-text-primary">4.8 rated by 2,400 guests</p>
            <p class="text-sm s-text-secondary">Thank you for staying with us</p>
        </div>
    </s-carousel>
</template>

<script setup>
import { SCarousel } from '@kundancool/simple-ui'
</script>
