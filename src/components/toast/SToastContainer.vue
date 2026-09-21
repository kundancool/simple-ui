<template>
    <div
        class="fixed top-4 inset-x-3 md:inset-x-auto md:right-4 flex flex-col gap-2 pointer-events-none"
        style="z-index: var(--s-z-toast)"
    >
        <TransitionGroup name="s-toast" tag="div" class="flex flex-col gap-2">
            <div v-for="t in toasts" :key="t.id" class="pointer-events-auto">
                <SToast :toast="t" @close="remove(t.id)" />
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup>
import { useToast } from '../../composables/useToast'
import SToast from './SToast.vue'

defineOptions({ name: 'SToastContainer' })

const { toasts, remove } = useToast()
</script>
