<template>
    <div>
        <DemoStage title="Live housekeeping board">
            <s-page-header title="Housekeeping" subtitle="Tap a card to move it across the board." />
            <div class="grid sm:grid-cols-3 gap-3">
                <s-card v-for="col in columns" :key="col.title" :title="`${col.title} (${col.tasks.length})`">
                    <div class="space-y-2 min-h-[120px]">
                        <button
                            v-for="task in col.tasks"
                            :key="task.id"
                            type="button"
                            class="s-focus-ring w-full text-left border s-border-theme rounded-lg p-2.5 s-bg-app transition-colors"
                            @click="advance(col, task)"
                        >
                            <span class="flex items-center gap-2">
                                <s-tag :type="task.tone" size="sm">{{ task.room }}</s-tag>
                                <span class="text-xs s-text-muted ml-auto">{{ task.time }}</span>
                            </span>
                            <span class="block text-sm s-text-primary mt-1">{{ task.title }}</span>
                        </button>
                        <p v-if="!col.tasks.length" class="text-xs s-text-muted text-center py-4">All clear</p>
                    </div>
                </s-card>
            </div>
        </DemoStage>
        <DemoSource file="DemoKanban.vue" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SPageHeader } from '@kundancool/simple-ui'
import { SCard } from '@kundancool/simple-ui'
import { STag } from '@kundancool/simple-ui'

const columns = ref([
    { title: 'To clean', tasks: [
        { id: 1, room: '204', tone: 'warning', time: '11:00', title: 'Checkout clean + linen change' },
        { id: 2, room: '207', tone: 'info', time: '12:30', title: 'Deep clean after long stay' },
    ] },
    { title: 'In progress', tasks: [
        { id: 3, room: '101', tone: 'info', time: '10:15', title: 'Bathroom regrout touch-up' },
    ] },
    { title: 'Done', tasks: [
        { id: 4, room: '305', tone: 'success', time: '09:00', title: 'Turndown + minibar restock' },
    ] },
])

function advance(col, task) {
    const i = columns.value.indexOf(col)
    col.tasks = col.tasks.filter((t) => t !== task)
    if (i < columns.value.length - 1) {
        columns.value[i + 1].tasks.push(task)
    } else {
        col.tasks.push(task)
    }
}
</script>
