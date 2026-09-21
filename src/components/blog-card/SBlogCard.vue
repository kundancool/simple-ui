<template>
    <component
        :is="linkTag"
        v-bind="linkAttrs"
        class="s-blog-card s-card rounded-xl overflow-hidden flex flex-col transition-shadow"
    >
        <div v-if="cover" class="aspect-[16/9] overflow-hidden s-bg-surface-raised">
            <img :src="cover" :alt="title" loading="lazy" class="w-full h-full object-cover" draggable="false" />
        </div>
        <div class="p-4 flex flex-col flex-1">
            <div v-if="tag || readingTime" class="flex items-center gap-2 mb-1.5">
                <s-tag v-if="tag" size="sm" :type="tagTone">{{ tag }}</s-tag>
                <span v-if="readingTime" class="text-[11px] s-text-muted">{{ readingTime }}</span>
            </div>
            <p class="text-sm font-semibold s-text-primary leading-snug">{{ title }}</p>
            <p v-if="excerpt" class="text-sm s-text-secondary mt-1 line-clamp-2">{{ excerpt }}</p>
            <div v-if="author || date" class="flex items-center gap-2 mt-3 pt-3 border-t s-border-theme">
                <s-avatar v-if="author" :name="author" size="xs" />
                <span class="min-w-0">
                    <span v-if="author" class="block text-xs font-medium s-text-primary truncate">{{ author }}</span>
                    <span v-if="date" class="block text-[11px] s-text-muted">{{ date }}</span>
                </span>
            </div>
        </div>
    </component>
</template>

<script setup>
import STag from '../tag/STag.vue'
import SAvatar from '../avatar/SAvatar.vue'

defineOptions({ name: 'SBlogCard' })

const props = defineProps({
    cover: { type: String, default: '' },
    tag: { type: String, default: '' },
    tagTone: { type: String, default: 'info' },
    title: { type: String, required: true },
    excerpt: { type: String, default: '' },
    author: { type: String, default: '' },
    date: { type: String, default: '' },
    readingTime: { type: String, default: '' },
    /** Link target. Omit for a static card. */
    to: { type: [String, Object], default: null },
    linkTag: { type: [String, Object, Function], default: 'a' },
    linkProps: { type: Function, default: null },
})

const linkAttrs = (() => {
    if (!props.to) {
        return {}
    }
    if (typeof props.linkProps === 'function') {
        return props.linkProps(props.to)
    }
    return props.linkTag === 'a' ? { href: props.to } : { to: props.to }
})()
</script>

<style>
.s-blog-card {
    text-decoration: none;
}
a.s-blog-card:hover {
    box-shadow: var(--s-shadow-md);
}
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
