<template>
    <div class="grid sm:grid-cols-3 gap-4">
        <div><s-skeleton :lines="3" /></div>
        <div class="flex items-center gap-2"><s-skeleton shape="circle" size="10" /><s-skeleton width="60%" /></div>
        <div><s-skeleton height="12" rounded="lg" /></div>
    </div>
</template>

<script setup>
import { SSkeleton } from '@kundancool/simple-ui'
</script>
