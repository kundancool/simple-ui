<template>
    <nav aria-label="Breadcrumb" class="min-w-0">
        <ol class="flex items-center gap-2 min-w-0 text-sm">
            <li v-for="(item, index) in items" :key="itemKey(item, index)" class="flex items-center gap-2 min-w-0" :class="{ 'flex-1': index === items.length - 1 }">
                <svg v-if="index > 0" class="w-3.5 h-3.5 s-text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                <component
                    :is="isLast(index) ? 'span' : item.to ? linkTag : 'span'"
                    v-bind="isLast(index) || !item.to ? {} : linkAttrs(item)"
                    :aria-current="isLast(index) ? 'page' : undefined"
                    :class="[
                        'truncate',
                        isLast(index) ? 's-text-primary font-semibold' : 's-text-muted s-crumb-link transition-colors',
                    ]"
                    @click="isLast(index) ? null : navigate(item)"
                >
                    {{ item.label }}
                </component>
            </li>
        </ol>
    </nav>
</template>

<script setup>
defineOptions({ name: 'SBreadcrumb' })

const props = defineProps({
    /** [{ label, to?, ...rest }] — last item renders as current page. */
    items: { type: Array, required: true },
    /** Link renderer for non-current items. Defaults to a plain anchor. */
    linkTag: { type: [String, Object, Function], default: 'a' },
    /** (item) => extra attrs for every link. */
    linkProps: { type: Function, default: null },
})

const emit = defineEmits(['navigate'])

function itemKey(item, index) {
    return item.to ?? item.label ?? index
}

function isLast(index) {
    return index === props.items.length - 1
}

function linkAttrs(item) {
    if (typeof props.linkProps === 'function') {
        return props.linkProps(item)
    }
    return props.linkTag === 'a' ? { href: item.to ?? '#' } : { to: item.to }
}

function navigate(item) {
    emit('navigate', item)
}
</script>

<style>
.s-crumb-link:hover {
    color: var(--s-accent-text);
}
</style>
