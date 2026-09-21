<template>
    <div>
        <DemoStage title="Live inbox">
            <div class="grid lg:grid-cols-3 gap-3">
                <s-card class="lg:col-span-1" padding>
                    <s-filter v-model="query" placeholder="Search threads…" @search="noop" />
                    <div class="-mx-1">
                        <button
                            v-for="t in filtered"
                            :key="t.id"
                            type="button"
                            class="s-focus-ring w-full text-left px-2 py-2 rounded-lg transition-colors"
                            :class="t.id === active.id ? 's-bg-accent-subtle' : 's-thread-hover'"
                            @click="open(t)"
                        >
                            <span class="flex items-center gap-2">
                                <s-avatar :name="t.from" size="xs" />
                                <span class="min-w-0 flex-1">
                                    <span class="flex items-center gap-2">
                                        <span class="text-sm font-medium truncate" :class="t.id === active.id ? 's-text-accent' : 's-text-primary'">{{ t.subject }}</span>
                                        <s-tag v-if="t.unread" type="info" size="sm">New</s-tag>
                                    </span>
                                    <span class="block text-xs s-text-muted truncate mt-0.5">{{ t.preview }}</span>
                                </span>
                            </span>
                        </button>
                    </div>
                </s-card>
                <s-card :title="active.subject" class="lg:col-span-2">
                    <div class="space-y-3">
                        <div v-for="m in active.messages" :key="m.id" class="flex gap-2" :class="m.mine ? 'flex-row-reverse' : ''">
                            <s-avatar :name="m.mine ? 'Front Desk' : active.from" size="xs" />
                            <div class="max-w-[75%] px-3 py-2 rounded-xl text-sm" :class="m.mine ? 's-bg-accent s-text-on-accent' : 's-bg-surface-raised s-text-primary'">{{ m.text }}</div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 mt-4">
                        <div class="flex-1"><s-input v-model="draft" placeholder="Reply…" inline @keyup.enter="send" /></div>
                        <s-button size="sm" @click="send">Send</s-button>
                    </div>
                </s-card>
            </div>
        </DemoStage>
        <DemoSource file="DemoInbox.vue" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SCard } from '@kundancool/simple-ui'
import { SFilter } from '@kundancool/simple-ui'
import { STag } from '@kundancool/simple-ui'
import { SInput } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'
import { SAvatar } from '@kundancool/simple-ui'

const threads = ref([
    { id: 1, from: 'Aarav Sharma', subject: 'Late checkout request', preview: 'Could we stay till 2pm on Sunday?', unread: true, messages: [
        { id: 1, who: 'AS', text: 'Hi! Could we stay till 2pm on Sunday?', mine: false },
        { id: 2, who: 'FD', text: 'Of course — late checkout is on us.', mine: true },
    ] },
    { id: 2, from: 'Diya Patel', subject: 'Invoice for TMZ-102', preview: 'Please share the GST invoice.', unread: false, messages: [
        { id: 1, who: 'DP', text: 'Please share the GST invoice for our stay.', mine: false },
    ] },
    { id: 3, from: 'Kabir Singh', subject: 'Airport pickup', preview: 'Flight lands at 11:40pm…', unread: true, messages: [
        { id: 1, who: 'KS', text: 'Flight lands at 11:40pm — will pickup be there?', mine: false },
    ] },
])
const active = ref(threads.value[0])
const query = ref('')
const draft = ref('')

const filtered = computed(() => {
    const q = query.value.trim().toLowerCase()
    return threads.value.filter((t) => !q || t.subject.toLowerCase().includes(q) || t.preview.toLowerCase().includes(q))
})

function open(t) {
    t.unread = false
    active.value = t
}

function send() {
    if (!draft.value.trim()) {
        return
    }
    active.value.messages.push({ id: Date.now(), who: 'FD', text: draft.value.trim(), mine: true })
    draft.value = ''
}

function noop() {}
</script>

<style>
.s-thread-hover:hover {
    background-color: var(--s-surface-raised);
}
</style>
