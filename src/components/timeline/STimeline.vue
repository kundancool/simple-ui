<template>
    <ol class="relative ml-2 border-l s-border-theme space-y-5 pl-5 py-1">
        <li v-for="(item, index) in items" :key="item.key ?? index" class="relative">
            <slot name="dot" :item="item" :index="index">
                <span class="absolute -left-[27px] top-0.5 w-3 h-3 rounded-full border-2 s-bg-surface" :class="dotClass(item.tone)" />
            </slot>
            <slot :item="item" :index="index">
                <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <s-tag v-if="item.tag" :type="item.tone ?? 'default'" size="sm">{{ item.tag }}</s-tag>
                    <p class="text-sm s-text-primary">{{ item.title }}</p>
                </div>
                <p v-if="item.description" class="text-xs s-text-muted mt-0.5">{{ item.description }}</p>
                <p v-if="item.time" class="text-xs s-text-muted mt-0.5">{{ item.time }}</p>
            </slot>
        </li>
    </ol>
</template>

<script setup>
import STag from '../tag/STag.vue'

defineOptions({ name: 'STimeline' })

defineProps({
    /** [{ key?, title, description?, time?, tag?, tone? }] */
    items: { type: Array, required: true },
})

function dotClass(tone) {
    const map = {
        success: 's-border-success',
        warning: 's-border-warning',
        danger: 's-border-danger',
        info: 's-border-icon-blue',
    }
    return map[tone] ?? 's-border-strong'
}
</script>
