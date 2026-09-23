<template>
    <button
        v-if="showTrigger"
        type="button"
        class="s-focus-ring s-spotlight-trigger hidden md:inline-flex items-center gap-1.5 px-3 h-8 text-sm font-semibold s-text-secondary rounded-md border s-border-theme whitespace-nowrap transition-colors"
        :aria-label="triggerLabel"
        @click="open"
    >
        <svg class="w-4 h-4 s-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span class="s-text-muted">{{ triggerLabel }}</span>
        <kbd class="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium s-text-muted s-bg-surface rounded border s-border-theme">{{ isMac ? '⌘' : 'Ctrl' }} K</kbd>
    </button>
    <button
        v-if="showTrigger"
        type="button"
        class="s-focus-ring s-spotlight-trigger md:hidden w-8 h-8 flex items-center justify-center rounded-full s-text-secondary border s-border-theme transition-colors"
        aria-label="Search"
        @click="open"
    >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    </button>

    <Teleport to="body">
        <Transition
            enter-active-class="transition-opacity duration-150" enter-from-class="opacity-0" enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0"
        >
            <div v-if="isOpen" class="fixed inset-0 flex items-start justify-center pt-[15vh]" :style="{ zIndex: zIndex }">
                <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="close" />
                <div
                    ref="panelRef"
                    data-overlay
                    role="dialog"
                    aria-modal="true"
                    :aria-label="placeholder"
                    class="s-spotlight-panel relative w-full mx-4 s-bg-surface rounded-xl border s-border-theme overflow-hidden"
                    :class="width"
                    :style="{ boxShadow: 'var(--s-shadow-lg)' }"
                >
                    <div class="s-palette-bar flex items-center gap-3 px-4 h-11 border-b s-border-theme">
                        <svg class="w-5 h-5 s-text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            ref="inputRef"
                            v-model="query"
                            type="text"
                            :placeholder="placeholder"
                            :aria-label="placeholder"
                            role="combobox"
                            aria-autocomplete="list"
                            :aria-expanded="true"
                            :aria-activedescendant="activeIndex >= 0 ? `${panelId}-${activeIndex}` : undefined"
                            class="s-palette-input flex-1 bg-transparent s-text-primary text-sm"
                            autocomplete="off"
                            @keydown="onKeydown"
                        />
                    </div>
                    <div class="overflow-y-auto" :class="resultsHeight" role="listbox">
                        <button
                            v-for="(item, index) in filtered"
                            :id="`${panelId}-${index}`"
                            :key="itemKey(item, index)"
                            type="button"
                            role="option"
                            :aria-selected="index === activeIndex"
                            class="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                            :class="index === activeIndex ? 's-bg-accent-subtle s-text-accent' : 's-text-primary s-spotlight-item'"
                            @click="choose(item)"
                            @mouseenter="activeIndex = index"
                        >
                            <slot name="item" :item="item" :active="index === activeIndex">
                                <component :is="item.icon" v-if="item.icon" class="w-5 h-5 flex-shrink-0" :class="index === activeIndex ? 's-text-accent' : 's-text-muted'" />
                                <span class="flex-1 min-w-0">
                                    <span class="block text-sm font-medium truncate">{{ item.label }}</span>
                                    <span v-if="item.hint" class="block text-xs s-text-muted truncate">{{ item.hint }}</span>
                                </span>
                            </slot>
                            <svg v-if="index === activeIndex" class="w-4 h-4 s-text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <p v-if="filtered.length === 0" class="px-4 py-8 text-center s-text-muted text-sm">{{ query ? emptyText : noResultsText }}</p>
                    </div>
                    <div v-if="showFooter" class="hidden sm:flex items-center gap-4 px-4 py-2.5 border-t s-border-theme s-bg-surface-raised text-xs s-text-muted">
                        <span class="inline-flex items-center gap-1.5"><kbd class="s-spotlight-kbd">↑↓</kbd> Navigate</span>
                        <span class="inline-flex items-center gap-1.5"><kbd class="s-spotlight-kbd">↵</kbd> Select</span>
                        <span class="inline-flex items-center gap-1.5"><kbd class="s-spotlight-kbd">esc</kbd> Close</span>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount, useId } from 'vue'
import { useListNavigation } from '../../composables/useListNavigation'

defineOptions({ name: 'SSearchPalette' })

const props = defineProps({
    /** [{ label, hint?, keywords?, icon?, ...rest }] — rest is passed through on select. */
    items: { type: Array, required: true },
    modelValue: { type: Boolean, default: false },
    placeholder: { type: String, default: 'Search...' },
    emptyText: { type: String, default: 'No matches.' },
    noResultsText: { type: String, default: 'Type to search.' },
    showTrigger: { type: Boolean, default: true },
    triggerLabel: { type: String, default: 'Search...' },
    /** Global shortcut (mod+k). Set false to manage opening yourself. */
    shortcut: { type: Boolean, default: true },
    width: { type: String, default: 'max-w-lg' },
    resultsHeight: { type: String, default: 'max-h-[40vh]' },
    showFooter: { type: Boolean, default: true },
    zIndex: { type: Number, default: 300 },
    /** Cap visible results for huge lists. */
    limit: { type: Number, default: 50 },
})

const emit = defineEmits(['update:modelValue', 'select'])

const query = ref('')
const inputRef = ref(null)
const panelId = useId()
const isMac = typeof navigator !== 'undefined' && /mac/i.test(navigator.platform ?? '')

const isOpen = computed(() => props.modelValue)

const filtered = computed(() => {
    const term = query.value.trim().toLowerCase()
    const pool = !term
        ? props.items
        : props.items.filter((item) =>
            [item.label, item.hint, item.keywords].filter(Boolean).join(' ').toLowerCase().includes(term),
        )
    return pool.slice(0, props.limit)
})

function itemKey(item, index) {
    return `${item.id ?? item.to ?? item.label ?? 'item'}-${index}`
}

function open() {
    emit('update:modelValue', true)
}

function close() {
    emit('update:modelValue', false)
}

function choose(item) {
    emit('select', item)
    close()
}

const { activeIndex, onKeydown: onListKeydown, reset } = useListNavigation(filtered, {
    onSelect: (item) => choose(item),
    onClose: () => close(),
    typeahead: false,
    label: (item) => String(item?.label ?? ''),
})

function onKeydown(event) {
    onListKeydown(event)
}

function onGlobalKeydown(event) {
    if (!props.shortcut) {
        return
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        if (props.modelValue) {
            close()
        } else {
            open()
        }
    }
}

watch(
    () => props.modelValue,
    (value) => {
        if (value) {
            query.value = ''
            reset()
            nextTick(() => inputRef.value?.focus())
        }
    },
)

onMounted(() => document.addEventListener('keydown', onGlobalKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onGlobalKeydown))

defineExpose({ open, close })
</script>

<style>
.s-palette-input:focus {
    outline: none;
}
/* Single indicator for mouse and keyboard focus alike: the bar underlines
   in accent while the input stays chrome-free. */
.s-palette-bar:focus-within {
    box-shadow: inset 0 -2px 0 0 var(--s-accent-text);
}
.s-spotlight-trigger:hover {
    border-color: var(--s-accent-border);
    color: var(--s-text-primary);
}
.s-spotlight-item:hover {
    background-color: var(--s-surface-raised);
}
.s-spotlight-kbd {
    display: inline-flex;
    align-items: center;
    padding: 0.125rem 0.5rem;
    font-size: 10px;
    font-weight: 500;
    border-radius: 0.25rem;
    border: 1px solid var(--s-border);
    background-color: var(--s-surface);
}
</style>
