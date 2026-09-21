<template>
    <Teleport to="body">
        <Transition
            enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100"
            leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0"
        >
            <div
                v-if="open"
                class="fixed inset-0 flex items-center justify-center bg-black/85 p-4"
                :style="{ zIndex: zIndex }"
                role="dialog"
                aria-modal="true"
                aria-label="Image viewer"
                @click.self="close"
            >
                <button
                    type="button"
                    aria-label="Close viewer"
                    class="s-lightbox-btn absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full text-white/80"
                    @click="close"
                >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <button
                    v-if="images.length > 1"
                    type="button"
                    aria-label="Previous image"
                    class="s-lightbox-btn absolute left-2 md:left-6 w-9 h-9 flex items-center justify-center rounded-full text-white/80"
                    @click="step(-1)"
                >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <figure class="max-w-5xl w-full text-center">
                    <img :src="current?.src" :alt="current?.alt ?? `Image ${at + 1}`" class="max-h-[80vh] w-auto mx-auto rounded-lg object-contain" draggable="false" />
                    <figcaption v-if="showCounter && images.length > 1" class="mt-3 text-xs text-white/70 tabular-nums">{{ at + 1 }} / {{ images.length }}</figcaption>
                    <figcaption v-if="current?.caption" class="mt-1 text-sm text-white/80">{{ current.caption }}</figcaption>
                </figure>
                <button
                    v-if="images.length > 1"
                    type="button"
                    aria-label="Next image"
                    class="s-lightbox-btn absolute right-2 md:right-6 w-9 h-9 flex items-center justify-center rounded-full text-white/80"
                    @click="step(1)"
                >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { computed, watch, ref, onBeforeUnmount } from 'vue'
import { lockBodyScroll, unlockBodyScroll } from '../../utils/scrollLock'

defineOptions({ name: 'SLightbox' })

const props = defineProps({
    /** [{ src, alt?, caption? }] */
    images: { type: Array, default: () => [] },
    open: { type: Boolean, default: false },
    /** Start / current index. */
    index: { type: Number, default: 0 },
    loop: { type: Boolean, default: true },
    showCounter: { type: Boolean, default: true },
    closeOnEsc: { type: Boolean, default: true },
    zIndex: { type: Number, default: 300 },
})

const emit = defineEmits(['update:open', 'update:index', 'close'])

/** Uncontrolled position — used while no v-model:index value writes back. */
const inner = ref(null)

watch(
    () => props.index,
    (value) => {
        inner.value = value
    },
)

const at = computed(() => {
    if (!props.images.length) {
        return 0
    }
    const source = inner.value ?? props.index
    return Math.max(0, Math.min(source, props.images.length - 1))
})

const current = computed(() => props.images[at.value])

function close() {
    emit('update:open', false)
    emit('close')
}

function step(delta) {
    if (!props.images.length) {
        return
    }
    let next = at.value + delta
    if (props.loop) {
        next = (next + props.images.length) % props.images.length
    } else {
        next = Math.max(0, Math.min(props.images.length - 1, next))
    }
    inner.value = next
    emit('update:index', next)
}

function onKeydown(e) {
    if (!props.open) {
        return
    }
    if (e.key === 'Escape' && props.closeOnEsc) {
        close()
    } else if (e.key === 'ArrowRight') {
        step(1)
    } else if (e.key === 'ArrowLeft') {
        step(-1)
    }
}

watch(
    () => props.open,
    (value) => {
        if (value) {
            document.addEventListener('keydown', onKeydown)
            lockBodyScroll()
        } else {
            document.removeEventListener('keydown', onKeydown)
            unlockBodyScroll()
        }
    },
    { immediate: true },
)

onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeydown)
    if (props.open) {
        unlockBodyScroll()
    }
})
</script>

<style>
.s-lightbox-btn {
    background-color: rgba(255, 255, 255, 0.08);
    transition: background-color 150ms ease;
}
.s-lightbox-btn:hover {
    background-color: rgba(255, 255, 255, 0.18);
}
</style>
