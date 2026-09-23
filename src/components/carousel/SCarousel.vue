<template>
    <div
        class="s-carousel relative overflow-hidden rounded-xl border s-border-theme"
        :style="{ height }"
        role="region"
        aria-roledescription="carousel"
        aria-label="Image carousel"
        @mouseenter="pause"
        @mouseleave="resume"
    >
        <div
            class="flex h-full transition-transform"
            :style="{ transform: `translateX(-${at * 100}%)`, transitionDuration: `${speed}ms` }"
            @touchstart.passive="onTouchStart"
            @touchend.passive="onTouchEnd"
        >
            <div v-for="(slide, index) in slides" :key="slide.key ?? index" class="w-full h-full flex-shrink-0" :aria-hidden="index !== at">
                <component :is="slide" />
            </div>
        </div>
        <template v-if="slides.length > 1">
            <button
                v-if="arrows"
                type="button"
                aria-label="Previous slide"
                class="s-carousel-arrow absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full text-white"
                @click="step(-1)"
            >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
                v-if="arrows"
                type="button"
                aria-label="Next slide"
                class="s-carousel-arrow absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full text-white"
                @click="step(1)"
            >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
            <div v-if="dots" class="absolute bottom-2.5 inset-x-0 flex justify-center gap-1.5" role="tablist" aria-label="Slides">
                <button
                    v-for="(slide, index) in slides"
                    :key="slide.key ?? index"
                    type="button"
                    role="tab"
                    :aria-selected="index === at"
                    :aria-label="`Go to slide ${index + 1}`"
                    class="s-carousel-dot h-1.5 rounded-full transition-all"
                    :class="index === at ? 'w-6 s-bg-accent' : 'w-1.5 bg-white/50 hover:bg-white/80'"
                    @click="go(index)"
                />
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, computed, useSlots, onMounted, onBeforeUnmount, Fragment, watch } from 'vue'

defineOptions({ name: 'SCarousel' })

const props = defineProps({
    modelValue: { type: Number, default: 0 },
    /** Autoplay ms. 0 disables. Pauses on hover. */
    interval: { type: Number, default: 0 },
    height: { type: String, default: '320px' },
    arrows: { type: Boolean, default: true },
    dots: { type: Boolean, default: true },
    loop: { type: Boolean, default: true },
    /** Slide transition ms. */
    speed: { type: Number, default: 300 },
})

const emit = defineEmits(['update:modelValue', 'change'])
const slots = useSlots()

function flatten(nodes) {
    return (nodes ?? []).flatMap((node) => (node.type === Fragment ? flatten(node.children ?? []) : [node]))
}

const slides = computed(() => flatten(slots.default?.()))

const at = computed(() => {
    if (!slides.value.length) {
        return 0
    }
    // Controlled when the parent writes back through v-model; otherwise the
    // internal position (advanced below) drives the UI.
    const source = inner.value ?? props.modelValue
    return Math.max(0, Math.min(source, slides.value.length - 1))
})

const inner = ref(null)

watch(
    () => props.modelValue,
    (value) => {
        inner.value = value
    },
)

let timer = null

function go(index) {
    inner.value = index
    emit('update:modelValue', index)
    emit('change', index)
    restart()
}

function step(delta) {
    if (!slides.value.length) {
        return
    }
    let next = at.value + delta
    if (props.loop) {
        next = (next + slides.value.length) % slides.value.length
    } else {
        next = Math.max(0, Math.min(slides.value.length - 1, next))
    }
    go(next)
}

function restart() {
    stop()
    if (props.interval > 0 && slides.value.length > 1) {
        timer = setTimeout(() => step(1), props.interval)
    }
}

function stop() {
    if (timer) {
        clearTimeout(timer)
        timer = null
    }
}

function pause() {
    stop()
}

function resume() {
    restart()
}

let touchX = null

function onTouchStart(e) {
    touchX = e.changedTouches[0]?.clientX ?? null
}

function onTouchEnd(e) {
    if (touchX === null) {
        return
    }
    const delta = (e.changedTouches[0]?.clientX ?? touchX) - touchX
    touchX = null
    if (Math.abs(delta) > 40) {
        step(delta < 0 ? 1 : -1)
    }
}

onMounted(restart)
onBeforeUnmount(stop)

defineExpose({ next: () => step(1), prev: () => step(-1), go })
</script>

<style>
.s-carousel-arrow {
    background-color: rgba(0, 0, 0, 0.35);
    transition: background-color 150ms ease;
}
.s-carousel-arrow:hover {
    background-color: rgba(0, 0, 0, 0.55);
}
@media (prefers-reduced-motion: reduce) {
    .s-carousel > div {
        transition: none;
    }
}
</style>
