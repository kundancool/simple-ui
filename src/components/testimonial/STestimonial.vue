<template>
    <figure class="s-card rounded-xl p-4 h-full flex flex-col">
        <s-rating :model-value="rating" readonly size="sm" />
        <blockquote class="text-sm s-text-primary mt-2 flex-1">“{{ quote }}”</blockquote>
        <figcaption class="flex items-center gap-2 mt-3">
            <s-avatar :name="name" :src="avatar" size="sm" :tone="tone" />
            <span class="min-w-0">
                <span class="block text-xs font-semibold s-text-primary truncate">{{ name }}</span>
                <span v-if="role" class="block text-[11px] s-text-muted truncate">{{ role }}</span>
            </span>
        </figcaption>
    </figure>
</template>

<script setup>
import SRating from '../rating/SRating.vue'
import SAvatar from '../avatar/SAvatar.vue'

defineOptions({ name: 'STestimonial' })

defineProps({
    quote: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, default: '' },
    rating: { type: Number, default: 5 },
    avatar: { type: String, default: '' },
    tone: { type: String, default: 'purple' },
})
</script>
