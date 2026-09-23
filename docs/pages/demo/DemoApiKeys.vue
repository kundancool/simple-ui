<template>
    <div>
        <DemoStage title="Live API keys">
            <s-page-header class="mb-5" title="API keys" subtitle="Keys inherit your permissions. Rotate often." add-text="New key" @add="dialog = true" />
            <s-card>
                <div v-for="k in keys" :key="k.id" class="flex items-center gap-3 py-3 border-b s-border-theme last:border-0">
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium s-text-primary flex items-center gap-2">{{ k.name }} <s-tag v-if="k.stale" type="warning" size="sm">90+ days old</s-tag></p>
                        <p class="font-mono text-xs s-text-muted truncate">{{ k.prefix }}…{{ k.tail }}</p>
                    </div>
                    <span class="hidden sm:inline text-xs s-text-muted whitespace-nowrap"><s-relative-time :value="k.used" /></span>
                    <s-copy :value="k.prefix + k.tail" />
                    <s-button size="sm" variant="secondary" @click="rotate(k)">Rotate</s-button>
                    <s-button size="sm" variant="ghost" @click="remove(k)"><span class="s-text-danger">Revoke</span></s-button>
                </div>
            </s-card>
        </DemoStage>
        <s-dialog v-model="dialog" title="New API key" width="sm">
            <s-input v-model="name" label="Key name" placeholder="e.g. reporting cron" :error="nameError" />
            <template #footer>
                <s-button variant="secondary" @click="dialog = false">Cancel</s-button>
                <s-button @click="create">Create key</s-button>
            </template>
        </s-dialog>
        <DemoSource file="DemoApiKeys.vue" />
        <s-toast-container />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SPageHeader } from '@kundancool/simple-ui'
import { SCard } from '@kundancool/simple-ui'
import { STag } from '@kundancool/simple-ui'
import { SCopy } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'
import { SDialog } from '@kundancool/simple-ui'
import { SInput } from '@kundancool/simple-ui'
import { SRelativeTime } from '@kundancool/simple-ui'
import { SToastContainer } from '@kundancool/simple-ui'
import { useToast } from '@kundancool/simple-ui'

const { success } = useToast()
const now = Date.now()
const keys = ref([
    { id: 1, name: 'Production', prefix: 'sk_live_', tail: '9f2c', used: now - 1000 * 60 * 12, stale: false },
    { id: 2, name: 'Reporting cron', prefix: 'sk_live_', tail: '41ab', used: now - 1000 * 60 * 60 * 26, stale: true },
])
const dialog = ref(false)
const name = ref('')
const nameError = ref('')

function create() {
    nameError.value = name.value.trim() ? '' : 'Name is required.'
    if (nameError.value) {
        return
    }
    keys.value.push({ id: Date.now(), name: name.value.trim(), prefix: 'sk_live_', tail: Math.random().toString(16).slice(2, 6), used: Date.now(), stale: false })
    name.value = ''
    dialog.value = false
    success('Key created — copy it now, it shows once.')
}

function rotate(k) {
    k.tail = Math.random().toString(16).slice(2, 6)
    k.used = Date.now()
    k.stale = false
    success(`${k.name} rotated.`)
}

function remove(k) {
    keys.value = keys.value.filter((x) => x !== k)
    success(`${k.name} revoked.`)
}
</script>
