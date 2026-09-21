<template>
    <div>
        <div
            class="grid gap-2"
            :class="columnClass"
            role="list"
            aria-label="Image gallery"
        >
            <button
                v-for="(image, index) in images"
                :key="image.src ?? index"
                type="button"
                role="listitem"
                class="s-focus-ring group relative overflow-hidden rounded-lg border s-border-theme s-bg-surface-raised aspect-[4/3]"
                :aria-label="`Open image ${index + 1}${image.alt ? `: ${image.alt}` : ''}`"
                @click="openAt(index)"
            >
                <img :src="image.src" :alt="image.alt ?? ''" loading="lazy" class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" draggable="false" />
                <span class="absolute inset-x-0 bottom-0 p-2 pt-6 text-left text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity" style="background: linear-gradient(transparent, rgba(0,0,0,0.55))">
                    {{ image.caption ?? image.alt ?? `Image ${index + 1}` }}
                </span>
            </button>
        </div>
        <s-empty v-if="!images.length" :title="emptyTitle" :description="emptyDescription" />
        <s-lightbox v-model:open="lightbox" v-model:index="at" :images="images" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SLightbox from '../lightbox/SLightbox.vue'
import SEmpty from '../empty/SEmpty.vue'

defineOptions({ name: 'SGallery' })

const props = defineProps({
    /** [{ src, alt?, caption? }] */
    images: { type: Array, default: () => [] },
    columns: { type: Number, default: 3, validator: (v) => [2, 3, 4].includes(v) },
    emptyTitle: { type: String, default: 'No images yet' },
    emptyDescription: { type: String, default: '' },
})

const lightbox = ref(false)
const at = ref(0)

const columnClass = computed(() => {
    const map = { 2: 'grid-cols-2', 3: 'grid-cols-2 sm:grid-cols-3', 4: 'grid-cols-2 sm:grid-cols-4' }
    return map[props.columns]
})

function openAt(index) {
    at.value = index
    lightbox.value = true
}
</script>
