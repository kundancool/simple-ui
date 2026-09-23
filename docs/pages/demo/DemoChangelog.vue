<template>
    <div>
        <DemoStage title="Live changelog">
            <s-page-header class="mb-5" title="Changelog" subtitle="What shipped, and when." />
            <s-tabs v-model="channel" :tabs="[{ key: 'all', label: 'All updates' }, { key: 'major', label: 'Major', count: 2 }, { key: 'fixes', label: 'Fixes' }]" />
            <div class="mt-3 space-y-3">
                <s-card v-for="r in visible" :key="r.version">
                    <div class="flex flex-wrap items-center gap-2">
                        <span class="font-mono text-sm font-bold s-text-primary">v{{ r.version }}</span>
                        <s-tag :type="r.major ? 'info' : 'default'" size="sm">{{ r.major ? 'Major' : 'Patch' }}</s-tag>
                        <span class="text-xs s-text-muted ml-auto"><s-relative-time :value="r.at" /></span>
                    </div>
                    <ul class="mt-2 space-y-1">
                        <li v-for="c in r.changes" :key="c" class="flex items-start gap-2 text-sm s-text-secondary">
                            <span class="w-1 h-1 rounded-full s-bg-border-theme mt-1.5 flex-shrink-0" />{{ c }}
                        </li>
                    </ul>
                </s-card>
            </div>
        </DemoStage>
        <DemoSource file="DemoChangelog.vue" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SPageHeader } from '@kundancool/simple-ui'
import { STabs } from '@kundancool/simple-ui'
import { SCard } from '@kundancool/simple-ui'
import { STag } from '@kundancool/simple-ui'
import { SRelativeTime } from '@kundancool/simple-ui'

const now = Date.now()
const releases = [
    { version: '2.4.0', major: true, at: now - 1000 * 60 * 60 * 26, changes: ['Two-up range calendar across every date picker', 'Spotlight palette (⌘K) in the docs shell'] },
    { version: '2.3.1', major: false, at: now - 1000 * 60 * 60 * 24 * 4, changes: ['Fixed pagination resetting on filter change', 'Faster toast stacking on mobile'] },
    { version: '2.3.0', major: true, at: now - 1000 * 60 * 60 * 24 * 11, changes: ['Roles & permissions matrix', 'API key rotation with one click'] },
    { version: '2.2.4', major: false, at: now - 1000 * 60 * 60 * 24 * 18, changes: ['Corrected tax rounding on split payments'] },
]
const channel = ref('all')
const visible = computed(() => {
    if (channel.value === 'major') {
        return releases.filter((r) => r.major)
    }
    if (channel.value === 'fixes') {
        return releases.filter((r) => !r.major)
    }
    return releases
})
</script>
