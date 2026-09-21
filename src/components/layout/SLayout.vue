<template>
    <div class="flex h-screen overflow-hidden s-bg-app">
        <Transition
            enter-active-class="transition-opacity duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0"
        >
            <div v-if="sidebarOpen && isMobile" class="fixed inset-0 z-30 bg-black/50" @click="$emit('update:sidebarOpen', false)" />
        </Transition>

        <aside
            :class="[
                sidebarOpen ? 'translate-x-0 w-full md:relative md:w-64' : '-translate-x-full w-full md:w-64',
            ]"
            class="fixed inset-y-0 left-0 z-40 flex flex-col flex-shrink-0 s-bg-sidebar border-r s-border-theme transition-all duration-300 ease-in-out"
            :style="{ boxShadow: 'var(--s-shadow-sm)' }"
        >
            <div class="flex items-center h-16 px-4 border-b s-border-theme flex-shrink-0">
                <slot name="brand">
                    <div class="flex items-center gap-3 min-w-0">
                        <div class="w-8 h-8 rounded-lg s-bg-accent flex items-center justify-center flex-shrink-0">
                            <span class="text-white font-bold text-sm">{{ brandInitial }}</span>
                        </div>
                        <span class="s-text-primary font-semibold text-sm tracking-wide truncate">{{ brandName }}</span>
                    </div>
                </slot>
                <button
                    class="s-focus-ring ml-auto flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-md s-text-secondary"
                    aria-label="Collapse sidebar"
                    @click="$emit('update:sidebarOpen', false)"
                >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                </button>
            </div>

            <div class="flex-1 overflow-hidden flex flex-col min-h-0">
                <slot name="menu" />
            </div>

            <div class="border-t s-border-theme p-3 flex-shrink-0 text-center">
                <slot name="footer">
                    <p class="text-xs s-text-muted">{{ footerText }}</p>
                </slot>
            </div>
        </aside>

        <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
            <header class="h-16 flex-shrink-0 flex items-center justify-between gap-2 md:gap-4 px-3 md:px-6 s-bg-surface border-b s-border-theme" :style="{ boxShadow: 'var(--s-shadow-xs)' }">
                <div class="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                    <button
                        v-if="!sidebarOpen"
                        class="s-focus-ring flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md s-text-secondary"
                        aria-label="Open sidebar"
                        @click="$emit('update:sidebarOpen', true)"
                    >
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                    <slot name="header-left" />
                </div>
                <div class="flex items-center gap-2 md:gap-3 flex-shrink-0">
                    <slot name="header-right" />
                </div>
            </header>

            <main class="flex-1 overflow-y-auto p-3 md:p-6">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineOptions({ name: 'SLayout' })

defineProps({
    /** v-model:sidebarOpen — collapsed state owned by the app. */
    sidebarOpen: { type: Boolean, default: true },
    brandName: { type: String, default: 'Simple UI' },
    brandInitial: { type: String, default: 'S' },
    footerText: { type: String, default: '' },
})

defineEmits(['update:sidebarOpen'])

const isMobile = ref(typeof window !== 'undefined' ? window.innerWidth < 768 : false)

function onResize() {
    isMobile.value = window.innerWidth < 768
}

onMounted(() => window.addEventListener('resize', onResize))
onBeforeUnmount(() => window.removeEventListener('resize', onResize))
</script>

<style>
.s-layout-toggle:hover {
    color: var(--s-text-primary);
    background-color: var(--s-surface-raised);
}
</style>
