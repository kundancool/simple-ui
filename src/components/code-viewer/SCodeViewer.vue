<template>
    <div class="s-code-viewer border s-border-theme rounded-md overflow-hidden">
        <div v-if="label || language" class="flex items-center justify-between gap-2 px-3 py-1.5 border-b s-border-theme s-bg-surface-raised">
            <span class="text-xs font-medium s-text-secondary truncate">{{ label || language }}</span>
            <button
                type="button"
                class="s-focus-ring text-xs s-text-muted transition-colors"
                @click="copy"
            >{{ copied ? 'Copied' : 'Copy' }}</button>
        </div>
        <pre class="s-code-pre m-0 p-3 overflow-auto text-xs leading-relaxed s-text-primary" :style="{ maxHeight }"><code>{{ pretty }}</code></pre>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineOptions({ name: 'SCodeViewer' })

const props = defineProps({
    value: { type: String, default: '' },
    language: { type: String, default: '' },
    label: { type: String, default: '' },
    /** Pretty-print JSON when language is json. */
    prettify: { type: Boolean, default: true },
    maxHeight: { type: String, default: '24rem' },
})

const copied = ref(false)

const pretty = computed(() => {
    const input = props.value ?? ''
    if (props.prettify && props.language === 'json') {
        try {
            return JSON.stringify(JSON.parse(input), null, 2)
        } catch {
            return input
        }
    }
    return input
})

async function copy() {
    try {
        await navigator.clipboard.writeText(pretty.value)
    } catch {
        const ta = document.createElement('textarea')
        ta.value = pretty.value
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
.s-code-viewer {
    background-color: var(--s-surface);
}
.s-code-pre {
    font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
}
.s-code-viewer button:hover {
    color: var(--s-text-primary);
}
</style>
