<!-- demo: Three widths — sm, md and lg dialogs — the full scale lives in props. -->
<template>
    <div class="flex flex-wrap gap-2">
        <s-button size="sm" variant="secondary" @click="open('sm')">Small</s-button>
        <s-button size="sm" variant="secondary" @click="open('md')">Medium</s-button>
        <s-button size="sm" variant="secondary" @click="open('lg')">Large</s-button>
    </div>
    <s-dialog v-model="shown" title="Sized dialog" :width="width">
        <p class="text-sm s-text-secondary">Width <code>{{ width }}</code> — dialogs cap at 90% of the viewport on mobile.</p>
        <template #footer>
            <s-button @click="shown = false">Done</s-button>
        </template>
    </s-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { SButton } from '@kundancool/simple-ui'
import { SDialog } from '@kundancool/simple-ui'

const shown = ref(false)
const width = ref('md')

function open(w) {
    width.value = w
    shown.value = true
}
</script>
