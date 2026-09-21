<template>
    <div>
        <DemoStage title="Live chat">
            <s-card>
                <div class="flex items-center gap-2 pb-3 border-b s-border-theme">
                    <span class="relative w-9 h-9 rounded-full s-bg-icon-green flex items-center justify-center text-xs font-bold s-text-icon-green">S<span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full s-bg-success" style="box-shadow: 0 0 0 2px var(--s-surface)" /></span>
                    <div><p class="text-sm font-semibold s-text-primary">Support chat</p><p class="text-xs s-text-success">Online — replies instantly</p></div>
                </div>
                <div ref="logRef" class="space-y-2.5 py-4 h-64 overflow-y-auto">
                    <div v-for="m in messages" :key="m.id" class="flex" :class="m.mine ? 'justify-end' : 'justify-start'">
                        <div class="max-w-[80%] px-3 py-2 rounded-2xl text-sm" :class="m.mine ? 's-bg-accent s-text-on-accent rounded-br-md' : 's-bg-surface-raised s-text-primary rounded-bl-md'">
                            {{ m.text }}
                            <span class="block text-[10px] mt-0.5 opacity-70 text-right">{{ m.time }}</span>
                        </div>
                    </div>
                    <div v-if="typing" class="flex justify-start">
                        <div class="px-3 py-2.5 rounded-2xl rounded-bl-md s-bg-surface-raised flex gap-1">
                            <span class="s-typing-dot" /><span class="s-typing-dot s-typing-d1" /><span class="s-typing-dot s-typing-d2" />
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-2 pt-3 border-t s-border-theme">
                    <div class="flex-1"><s-input v-model="draft" placeholder="Type a message…" inline @keyup.enter="send" /></div>
                    <s-button size="sm" :disabled="!draft.trim()" @click="send">Send</s-button>
                </div>
            </s-card>
        </DemoStage>
        <DemoSource file="DemoChat.vue" />
    </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SCard } from '@kundancool/simple-ui'
import { SInput } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'

function clock() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const messages = ref([
    { id: 1, text: 'Hi! My keycard stopped working — room 204.', mine: false, time: clock() },
    { id: 2, text: 'Sorry about that! A new card is waiting at reception for you.', mine: true, time: clock() },
])
const draft = ref('')
const typing = ref(false)
const logRef = ref(null)

async function scroll() {
    await nextTick()
    logRef.value?.scrollTo({ top: logRef.value.scrollHeight })
}

function send() {
    if (!draft.value.trim()) {
        return
    }
    messages.value.push({ id: Date.now(), text: draft.value.trim(), mine: true, time: clock() })
    draft.value = ''
    scroll()
    typing.value = true
    setTimeout(() => {
        typing.value = false
        messages.value.push({ id: Date.now() + 1, text: 'Anything else I can help with?', mine: false, time: clock() })
        scroll()
    }, 1200)
}
</script>

<style>
.s-typing-dot {
    width: 6px;
    height: 6px;
    border-radius: 9999px;
    background-color: var(--s-text-muted);
    animation: s-typing 1.2s ease-in-out infinite;
}
.s-typing-d1 { animation-delay: 0.15s; }
.s-typing-d2 { animation-delay: 0.3s; }
@keyframes s-typing {
    0%, 60%, 100% { opacity: 0.35; transform: none; }
    30% { opacity: 1; transform: translateY(-2px); }
}
@media (prefers-reduced-motion: reduce) {
    .s-typing-dot { animation: none; opacity: 0.7; }
}
</style>
