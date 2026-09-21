<template>
    <div class="s-code-viewer border s-border-theme rounded-md overflow-hidden">
        <div class="flex items-center justify-between gap-2 px-3 py-1.5 border-b s-border-theme s-bg-surface-raised">
            <span class="text-xs font-medium s-text-secondary font-mono">{{ title }}</span>
            <button type="button" class="s-demo-copy text-xs s-text-muted transition-colors inline-flex items-center gap-1" @click="copy">
                <Copy v-if="!copied" class="w-3 h-3" /><Check v-else class="w-3 h-3" />{{ copied ? 'Copied' : 'Copy' }}
            </button>
        </div>
        <pre class="m-0 p-3 overflow-auto text-xs leading-relaxed s-code-pre s-text-primary s-bg-app"><code v-html="highlighted" /></pre>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Copy, Check } from 'lucide-vue-next'
import { highlight, guessLang } from './codeTheme'

const props = defineProps({
    code: { type: String, required: true },
    title: { type: String, default: 'Example' },
    lang: { type: String, default: '' },
})

const copied = ref(false)
const highlighted = computed(() => highlight(props.code, props.lang || guessLang(props.title, props.code)))

async function copy() {
    try {
        await navigator.clipboard.writeText(props.code)
    } catch {
        const ta = document.createElement('textarea')
        ta.value = props.code
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
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
.s-demo-copy:hover {
    color: var(--s-text-primary);
}
</style>
