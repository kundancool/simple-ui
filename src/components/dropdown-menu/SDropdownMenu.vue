<template>
    <span ref="triggerRef" class="inline-block">
        <div class="inline-block" @click.stop="toggleOpen">
            <slot name="trigger" :open="open">
                <SButton :size="size" :variant="variant">
                    {{ label }}
                    <svg class="w-3.5 h-3.5 ml-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </SButton>
            </slot>
        </div>
    </span>
    <Teleport to="body">
        <Transition name="s-pop">
            <div
                v-if="open"
                ref="panelRef"
                role="menu"
                tabindex="-1"
                :aria-activedescendant="activeIndex >= 0 ? `${menuId}-${activeIndex}` : undefined"
                data-overlay
                class="fixed s-bg-surface border s-border-theme rounded-md s-shadow-lg-theme py-1"
                :class="width"
                :style="panelStyle"
                @keydown="onKeydown"
            >
                <div v-if="loading" class="px-3 py-2 space-y-2" aria-busy="true">
                    <SSkeleton v-for="i in 3" :key="i" height="4" aria-label="Loading actions" />
                </div>
                <template v-for="(item, i) in loading ? [] : items" :key="item.key || `sep-${i}`">
                    <div v-if="item.type === 'separator'" role="separator" class="border-t s-border-theme my-1" />
                    <button
                        v-else
                        :id="`${menuId}-${navIndexOf(item)}`"
                        type="button"
                        role="menuitem"
                        tabindex="-1"
                        class="s-menu-item w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2"
                        :class="[
                            item.danger ? 's-text-danger' : 's-text-primary',
                            navIndexOf(item) === activeIndex ? (item.danger ? 's-bg-danger-subtle' : 's-bg-surface-raised') : '',
                        ]"
                        @click="select(item)"
                        @mouseenter="activeIndex = navIndexOf(item)"
                    >
                        <component :is="item.icon" v-if="item.icon" class="w-4 h-4 flex-shrink-0" />
                        <span class="flex-1">{{ item.label }}</span>
                    </button>
                </template>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount, useId } from 'vue'
import { useListNavigation } from '../../composables/useListNavigation'
import SButton from '../button/SButton.vue'
import SSkeleton from '../skeleton/SSkeleton.vue'

defineOptions({ name: 'SDropdownMenu' })

const props = defineProps({
    /** [{ key, label, icon?, danger?, keepOpen?, onClick?, type?: 'separator' }] */
    items: { type: Array, required: true },
    loading: { type: Boolean, default: false },
    label: { type: String, default: 'Actions' },
    size: { type: String, default: 'sm' },
    variant: { type: String, default: 'secondary' },
    width: { type: String, default: 'w-48' },
    align: { type: String, default: 'right', validator: (v) => ['left', 'right'].includes(v) },
})

const emit = defineEmits(['select'])

const menuId = useId()
const open = ref(false)
const triggerRef = ref(null)
const panelRef = ref(null)
const panelStyle = ref({})

const navigableItems = computed(() => (props.loading ? [] : props.items.filter((item) => item.type !== 'separator')))

const { activeIndex, onKeydown, reset } = useListNavigation(navigableItems, {
    onSelect: (item) => select(item),
    onClose: () => closeMenu(),
    typeahead: true,
    label: (item) => item.label ?? '',
})

function navIndexOf(item) {
    return navigableItems.value.indexOf(item)
}

function calcPosition() {
    const trigger = triggerRef.value?.firstElementChild
    if (!trigger?.getBoundingClientRect) {
        return
    }
    const rect = trigger.getBoundingClientRect()
    nextTick(() => {
        const panel = panelRef.value
        const pw = panel?.offsetWidth ?? 192
        const ph = panel?.offsetHeight ?? 100
        let top = rect.bottom + 4
        if (top + ph > window.innerHeight - 8) {
            top = rect.top - ph - 4
        }
        if (top < 8) {
            top = 8
        }
        let left = props.align === 'right' ? rect.right - pw : rect.left
        if (left < 8) {
            left = 8
        }
        if (left + pw > window.innerWidth - 8) {
            left = window.innerWidth - pw - 8
        }
        panelStyle.value = { top: `${top}px`, left: `${left}px`, zIndex: 'var(--s-z-dropdown)' }
    })
}

function toggleOpen() {
    open.value = !open.value
    if (!open.value) {
        return
    }
    reset()
    nextTick(() => {
        calcPosition()
        panelRef.value?.focus()
    })
}

function closeMenu() {
    if (!open.value) {
        return
    }
    open.value = false
    nextTick(() => triggerRef.value?.querySelector('button')?.focus())
}

function select(item) {
    if (typeof item.onClick === 'function') {
        item.onClick()
    }
    if (!item.keepOpen) {
        closeMenu()
    }
    emit('select', item)
}

function onClickOutside(e) {
    if (!open.value) {
        return
    }
    if (triggerRef.value?.contains(e.target)) {
        return
    }
    if (panelRef.value?.contains(e.target)) {
        return
    }
    open.value = false
}

function onScroll() {
    if (open.value) {
        calcPosition()
    }
}

function onResize() {
    if (open.value) {
        calcPosition()
    }
}

onMounted(() => {
    document.addEventListener('mousedown', onClickOutside)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onResize)
})
onBeforeUnmount(() => {
    document.removeEventListener('mousedown', onClickOutside)
    window.removeEventListener('scroll', onScroll, true)
    window.removeEventListener('resize', onResize)
})
</script>

<style>
.s-menu-item:hover {
    background-color: var(--s-surface-raised);
}
.s-menu-item.s-text-danger:hover {
    background-color: var(--s-danger-subtle);
}
</style>
