<template>
    <div class="grid sm:grid-cols-2 gap-3">
        <s-testimonial quote="Setup took two minutes and the dashboard looked great." name="Aarav Sharma" role="Customer since August" :rating="5" />
        <s-testimonial quote="Fast support, clear docs, perfect for our team." name="Meera Iyer" role="Customer since June" :rating="5" />
    </div>
</template>

<script setup>
import { STestimonial } from '@kundancool/simple-ui'
</script>
