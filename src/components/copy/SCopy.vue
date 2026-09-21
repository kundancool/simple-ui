<template>
    <button
        type="button"
        class="s-focus-ring s-copy-btn inline-flex items-center gap-1.5 s-text-secondary transition-colors cursor-pointer"
        :class="triggerClass"
        :title="title"
        @click.stop="copy"
    >
        <Transition name="s-copy-swap" mode="out-in">
            <slot v-if="!copied">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25" />
                </svg>
            </slot>
            <span v-else key="copied" class="text-xs font-medium s-text-success">Copied</span>
        </Transition>
    </button>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { useToast } from '../../composables/useToast'

defineOptions({ name: 'SCopy' })

const props = defineProps({
    value: { type: String, required: true },
    title: { type: String, default: 'Copy' },
    successMessage: { type: String, default: 'Copied to clipboard' },
    errorMessage: { type: String, default: 'Failed to copy' },
    triggerClass: { type: [String, Array, Object], default: '' },
})

const { success, error } = useToast()

const copied = ref(false)
let timer = null

function flashCopied() {
    copied.value = true
    clearTimeout(timer)
    timer = setTimeout(() => {
        copied.value = false
    }, 1000)
}

onBeforeUnmount(() => clearTimeout(timer))

async function copy() {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(props.value)
        } else {
            const textarea = document.createElement('textarea')
            textarea.value = props.value
            textarea.style.position = 'fixed'
            textarea.style.opacity = '0'
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand('copy')
            document.body.removeChild(textarea)
        }
        success(props.successMessage)
        flashCopied()
    } catch {
        error(props.errorMessage)
    }
}
</script>

<style>
.s-copy-btn:hover {
    color: var(--s-text-primary);
}
.s-copy-swap-enter-active,
.s-copy-swap-leave-active {
    transition: opacity var(--s-duration-fast) var(--s-ease-out), transform var(--s-duration-fast) var(--s-ease-out);
}
.s-copy-swap-enter-from,
.s-copy-swap-leave-to {
    opacity: 0;
    transform: translateY(3px) scale(0.92);
}
@media (prefers-reduced-motion: reduce) {
    .s-copy-swap-enter-active,
    .s-copy-swap-leave-active {
        transition-duration: 0.01ms;
    }
    .s-copy-swap-enter-from,
    .s-copy-swap-leave-to {
        transform: none;
    }
}
</style>
