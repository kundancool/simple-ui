<!-- demo: Every size — xs to xl avatars on the same row. -->
<template>
    <div class="flex items-center gap-3">
        <s-avatar name="K" size="xs" />
        <s-avatar name="Meera Iyer" size="sm" />
        <s-avatar name="Priya Nair" />
        <s-avatar name="Rahul Das" size="lg" />
        <s-avatar name="Aarav Sharma" size="xl" />
        <s-avatar name="Diya Patel" size="2xl" />
        <s-avatar name="Kabir Singh" size="3xl" />
    </div>
</template>

<script setup>
import { SAvatar } from '@kundancool/simple-ui'
</script>
