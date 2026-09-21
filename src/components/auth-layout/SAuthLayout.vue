<template>
    <div class="min-h-screen s-bg-app flex items-center justify-center p-4">
        <div class="w-full" :class="maxWidth">
            <div v-if="title || $slots.brand" class="text-center mb-8">
                <slot name="brand">
                    <h1 class="text-2xl font-bold s-text-primary tracking-tight">{{ title }}</h1>
                    <p v-if="subtitle" class="text-sm s-text-muted mt-1">{{ subtitle }}</p>
                </slot>
            </div>
            <slot />
        </div>
    </div>
</template>

<script setup>
defineOptions({ name: 'SAuthLayout' })

defineProps({
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    maxWidth: { type: String, default: 'max-w-md' },
})
</script>
