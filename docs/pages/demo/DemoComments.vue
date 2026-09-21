<template>
    <div>
        <DemoStage title="Live comments">
            <s-card title="Customer notes · ORD-101 (3)">
                <div class="space-y-4">
                    <div v-for="c in comments" :key="c.id" class="flex gap-2.5">
                        <s-avatar :name="c.name" size="sm" />
                        <div class="flex-1 min-w-0">
                            <p class="text-xs s-text-muted">{{ c.name }} · <s-relative-time :value="c.at" /></p>
                            <p class="text-sm s-text-primary mt-0.5">{{ c.text }}</p>
                            <div class="flex items-center gap-3 mt-1">
                                <button type="button" class="s-comment-act text-xs s-text-muted inline-flex items-center gap-1" @click="like(c)"><Heart class="w-3.5 h-3.5" :class="c.likes > 0 ? 's-text-danger' : ''" />{{ c.likes }}</button>
                                <button type="button" class="s-comment-act text-xs s-text-muted" @click="replyTo = replyTo === c.id ? null : c.id">Reply</button>
                            </div>
                            <div v-if="replyTo === c.id" class="flex items-center gap-2 mt-2">
                                <div class="flex-1"><s-input v-model="reply" placeholder="Write a reply…" inline /></div>
                                <s-button size="sm" @click="sendReply(c)">Post</s-button>
                            </div>
                            <div v-for="r in c.replies" :key="r.id" class="flex gap-2 mt-2 ml-4">
                                <s-avatar :name="r.name" size="xs" />
                                <p class="text-sm s-text-primary"><span class="text-xs s-text-muted">{{ r.name }} · </span>{{ r.text }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-2 mt-4 pt-4 border-t s-border-theme">
                    <div class="flex-1"><s-input v-model="draft" placeholder="Add a note…" inline @keyup.enter="post" /></div>
                    <s-button size="sm" @click="post">Post</s-button>
                </div>
            </s-card>
        </DemoStage>
        <DemoSource file="DemoComments.vue" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Heart } from 'lucide-vue-next'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SCard } from '@kundancool/simple-ui'
import { SInput } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'
import { SRelativeTime } from '@kundancool/simple-ui'
import { SAvatar } from '@kundancool/simple-ui'

const now = Date.now()
const comments = ref([
    { id: 1, who: 'FD', name: 'Support', at: now - 1000 * 60 * 50, text: 'Customer asked for an update on their refund request.', likes: 2, replies: [
        { id: 11, who: 'MG', name: 'Manager', text: 'Moved to 204 — noted for next time.' },
    ] },
    { id: 2, who: 'HK', name: 'Operations', at: now - 1000 * 60 * 60 * 3, text: 'Extra towels placed as requested.', likes: 0, replies: [] },
])
const draft = ref('')
const reply = ref('')
const replyTo = ref(null)

function post() {
    if (!draft.value.trim()) {
        return
    }
    comments.value.push({ id: Date.now(), who: 'FD', name: 'Support', at: Date.now(), text: draft.value.trim(), likes: 0, replies: [] })
    draft.value = ''
}

function like(c) {
    c.likes += 1
}

function sendReply(c) {
    if (!reply.value.trim()) {
        return
    }
    c.replies.push({ id: Date.now(), who: 'FD', name: 'Support', text: reply.value.trim() })
    reply.value = ''
    replyTo.value = null
}
</script>

<style>
.s-comment-act:hover {
    color: var(--s-accent-text);
}
</style>
