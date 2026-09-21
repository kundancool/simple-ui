<template>
    <div class="s-demo-stage border s-border-theme rounded-xl overflow-hidden">
        <div class="flex items-center gap-2 px-3 py-2 border-b s-border-theme s-bg-surface-raised">
            <span class="flex gap-1.5" aria-hidden="true">
                <span class="w-2.5 h-2.5 rounded-full s-demo-dot-r" />
                <span class="w-2.5 h-2.5 rounded-full s-demo-dot-y" />
                <span class="w-2.5 h-2.5 rounded-full s-demo-dot-g" />
            </span>
            <span class="text-[11px] font-semibold uppercase tracking-wider s-text-muted">Preview</span>
            <span v-if="title" class="text-xs s-text-secondary truncate">{{ title }}</span>
        </div>
        <div class="p-3 md:p-5 s-bg-app overflow-auto" :style="maxHeight ? { maxHeight } : undefined">
            <slot />
        </div>
    </div>
</template>

<script setup>
defineProps({
    title: { type: String, default: '' },
    /** Cap frame height with internal scroll, e.g. "80vh". */
    maxHeight: { type: String, default: '' },
})
</script>

<style>
.s-demo-dot-r { background-color: #ff5f57; }
.s-demo-dot-y { background-color: #febc2e; }
.s-demo-dot-g { background-color: #28c840; }
</style>
