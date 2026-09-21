<template>
    <div class="s-demo-card border s-border-theme rounded-xl overflow-hidden">
        <div class="p-4 md:p-5 s-bg-surface">
            <slot />
        </div>
        <div class="border-t s-border-theme">
            <button
                type="button"
                class="s-demo-toggle w-full flex items-center justify-center gap-1.5 py-2 text-xs s-text-muted transition-colors"
                :aria-expanded="showCode"
                @click="showCode = !showCode"
            >
                <ChevronDown class="w-3.5 h-3.5 transition-transform duration-200" :class="showCode ? 'rotate-180' : ''" />
                {{ showCode ? 'Hide code' : 'Show code' }}
            </button>
            <Transition name="s-fade-slide">
                <div v-show="showCode" class="border-t s-border-theme">
                    <div class="flex items-center justify-between gap-2 px-3 py-1.5 s-bg-surface-raised">
                        <span class="text-xs font-medium s-text-secondary font-mono">{{ title }}</span>
                        <button type="button" class="s-demo-copy text-xs s-text-muted transition-colors inline-flex items-center gap-1" @click="copy">
                            <Copy v-if="!copied" class="w-3 h-3" /><Check v-else class="w-3 h-3" />{{ copied ? 'Copied' : 'Copy' }}
                        </button>
                    </div>
                    <pre class="m-0 p-3 overflow-auto text-xs leading-relaxed s-code-pre s-text-primary s-bg-app"><code v-html="highlighted" /></pre>
                </div>
            </Transition>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChevronDown, Copy, Check } from 'lucide-vue-next'
import { highlight, guessLang } from './codeTheme'

const props = defineProps({
    code: { type: String, required: true },
    title: { type: String, default: 'Example.vue' },
    lang: { type: String, default: '' },
})

const showCode = ref(false)
const copied = ref(false)
const highlighted = computed(() => highlight(props.code, props.lang || guessLang(props.title, props.code)))

async function copy() {
    try {
        await navigator.clipboard.writeText(props.code)
    } catch {
        // clipboard unavailable — selection still possible manually
    }
    copied.value = true
    setTimeout(() => {
        copied.value = false
    }, 1500)
}
</script>

<style>
.s-code-pre {
    font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
    max-height: 28rem;
}
.s-demo-toggle:hover {
    color: var(--s-text-primary);
    background-color: var(--s-surface-raised);
}
.s-demo-copy:hover {
    color: var(--s-text-primary);
}
</style>
