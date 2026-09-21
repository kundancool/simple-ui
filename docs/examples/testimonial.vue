<template>
    <div class="grid sm:grid-cols-2 gap-3">
        <s-testimonial quote="Check-in took two minutes and the room was spotless." name="Aarav Sharma" role="Stayed in August" :rating="5" />
        <s-testimonial quote="Silent AC, fast Wi-Fi, perfect workcation setup." name="Meera Iyer" role="Stayed in June" :rating="5" />
    </div>
</template>

<script setup>
import { STestimonial } from '@kundancool/simple-ui'
</script>
