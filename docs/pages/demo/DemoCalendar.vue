<template>
    <div>
        <DemoStage title="Live events calendar">
            <s-page-header :title="monthLabel">
                <s-button size="sm" variant="secondary" @click="shift(-1)">← Prev</s-button>
                <s-button size="sm" variant="secondary" @click="today">Today</s-button>
                <s-button size="sm" variant="secondary" @click="shift(1)">Next →</s-button>
            </s-page-header>
            <s-card>
                <div class="grid grid-cols-7 gap-1 text-center text-[11px] font-medium s-text-muted mb-1">
                    <span v-for="d in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="d">{{ d }}</span>
                </div>
                <div class="grid grid-cols-7 gap-1">
                    <button
                        v-for="cell in cells"
                        :key="cell.key"
                        type="button"
                        :disabled="cell.other"
                        class="s-focus-ring min-h-[64px] rounded-lg border text-left p-1 transition-colors disabled:opacity-0"
                        :class="cell.today ? 's-border-accent' : 's-border-theme'"
                        @click="pick(cell)"
                    >
                        <span class="text-xs font-semibold" :class="cell.today ? 's-text-accent' : 's-text-secondary'">{{ cell.day }}</span>
                        <span v-for="e in cell.events.slice(0, 2)" :key="e" class="block truncate text-[10px] px-1 mt-0.5 rounded s-bg-accent-subtle s-text-accent">{{ e }}</span>
                        <span v-if="cell.events.length > 2" class="block text-[10px] s-text-muted px-1">+{{ cell.events.length - 2 }}</span>
                    </button>
                </div>
            </s-card>
            <s-dialog v-model="dialog" :title="`Events · ${selectedLabel}`" width="sm">
                <ul class="space-y-1.5">
                    <li v-for="e in selected" :key="e" class="text-sm s-text-primary flex items-center gap-2">
                        <span class="w-1.5 h-1.5 rounded-full s-bg-accent flex-shrink-0" />{{ e }}
                    </li>
                </ul>
                <p v-if="!selected.length" class="text-sm s-text-muted">A quiet day — nothing scheduled.</p>
                <template #footer><s-button size="sm" @click="dialog = false">Close</s-button></template>
            </s-dialog>
        </DemoStage>
        <DemoSource file="DemoCalendar.vue" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SPageHeader } from '@kundancool/simple-ui'
import { SCard } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'
import { SDialog } from '@kundancool/simple-ui'

const anchor = ref(new Date(2026, 8, 1))
const dialog = ref(false)
const selected = ref([])
const selectedLabel = ref('')

const diary = {
    '2026-09-03': ['3 new orders', 'Design review'],
    '2026-09-07': ['Rate review'],
    '2026-09-12': ['5 new orders', 'Client visit', 'Maintenance check'],
    '2026-09-18': ['Channel sync audit'],
    '2026-09-25': ['Festival block release'],
}

function iso(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const monthLabel = computed(() => anchor.value.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }))

const cells = computed(() => {
    const first = new Date(anchor.value.getFullYear(), anchor.value.getMonth(), 1)
    const start = new Date(first)
    start.setDate(start.getDate() - first.getDay())
    const todayIso = iso(new Date())
    return Array.from({ length: 35 }, (_, i) => {
        const date = new Date(start)
        date.setDate(start.getDate() + i)
        const key = iso(date)
        return { key, date, day: date.getDate(), other: date.getMonth() !== anchor.value.getMonth(), today: key === todayIso, events: diary[key] ?? [] }
    })
})

function shift(delta) {
    anchor.value = new Date(anchor.value.getFullYear(), anchor.value.getMonth() + delta, 1)
}

function today() {
    anchor.value = new Date()
}

function pick(cell) {
    selected.value = cell.events
    selectedLabel.value = cell.date.toLocaleDateString(undefined, { day: 'numeric', month: 'long' })
    dialog.value = true
}
</script>
