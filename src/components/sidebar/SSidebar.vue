<template>
    <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
        <div
            v-if="open && isMobile && overlay && fixed"
            class="fixed inset-0 z-30 bg-black/50"
            @click="close"
        />
    </Transition>

    <aside
        :class="[open ? 'translate-x-0' : '-translate-x-full', fixed ? 'fixed inset-y-0 left-0' : 'relative h-full']"
        :style="asideStyle"
        class="s-sidebar z-40 flex flex-col flex-shrink-0 max-w-[85vw] transition-all duration-300 ease-in-out s-bg-sidebar border-r s-border-theme md:relative"
    >
        <div class="flex items-center h-16 px-4 border-b s-border-theme flex-shrink-0">
            <slot name="brand" :close="close">
                <span class="flex items-center gap-3 min-w-0">
                    <span class="w-8 h-8 rounded-lg s-bg-accent flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{{ brandInitial }}</span>
                    <span class="min-w-0 leading-tight">
                        <span class="block s-text-primary font-semibold text-sm truncate">{{ brandName }}</span>
                        <span v-if="brandSub" class="block s-text-muted font-normal text-[11px]">{{ brandSub }}</span>
                    </span>
                </span>
            </slot>
            <button
                v-if="showClose"
                type="button"
                class="ml-auto flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-md s-text-secondary s-menu-section"
                aria-label="Collapse sidebar"
                @click="close"
            >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
            </button>
        </div>

        <div class="flex-1 overflow-hidden flex flex-col min-h-0">
            <slot />
        </div>

        <div v-if="$slots.footer" class="border-t s-border-theme p-3 flex-shrink-0">
            <slot name="footer" />
        </div>
    </aside>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

defineOptions({ name: 'SSidebar' })

const props = defineProps({
    /** v-model:open — expanded state, owned by the app (persist it if you like). */
    open: { type: Boolean, default: true },
    /** Sidebar width in px on desktop. */
    width: { type: Number, default: 288 },
    /** Viewport width below which the sidebar floats over an overlay. */
    breakpoint: { type: Number, default: 768 },
    /**
     * Fixed to the viewport (dashboard shell). Set false to embed inside a
     * container — e.g. framed previews — where it stays in normal flow.
     */
    fixed: { type: Boolean, default: true },
    /** Dim + block the page behind the sidebar on small screens. */
    overlay: { type: Boolean, default: true },
    showClose: { type: Boolean, default: true },
    brandName: { type: String, default: '' },
    brandInitial: { type: String, default: 'S' },
    brandSub: { type: String, default: '' },
})

const emit = defineEmits(['update:open', 'open', 'close'])

const isMobile = ref(typeof window !== 'undefined' ? window.innerWidth < props.breakpoint : false)

/**
 * A translated-off element still occupies layout space on desktop (where the
 * sidebar is in normal flow), leaving a blank gap. Pulling a negative margin
 * collapses the footprint so content expands — the slide animation is
 * unaffected. Fixed-positioned mobile needs no margin.
 */
const asideStyle = computed(() => ({
    width: `${props.width}px`,
    marginLeft: !props.open && !isMobile.value ? `-${props.width}px` : undefined,
}))

function onResize() {
    isMobile.value = window.innerWidth < props.breakpoint
}

function close() {
    emit('update:open', false)
    emit('close')
}

function openPanel() {
    emit('update:open', true)
    emit('open')
}

function onKeydown(e) {
    if (e.key === 'Escape' && props.open && isMobile.value) {
        close()
    }
}

onMounted(() => {
    window.addEventListener('resize', onResize)
    document.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize)
    document.removeEventListener('keydown', onKeydown)
})

defineExpose({ open: openPanel, close, isMobile })
</script>
