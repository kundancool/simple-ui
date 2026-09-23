<template>
    <div>
        <DemoStage title="Live file manager">
            <s-page-header class="mb-5" title="Files" subtitle="Workspace documents and customer uploads.">
                <s-button size="sm" variant="secondary" @click="notify('Upload dialog opening (demo).')">Upload</s-button>
            </s-page-header>
            <s-tabs v-model="view" :tabs="[{ key: 'grid', label: 'Grid' }, { key: 'list', label: 'List' }]" />
            <div v-if="view === 'grid'" class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                <button
                    v-for="f in files"
                    :key="f.name"
                    type="button"
                    class="s-focus-ring border rounded-xl p-3 text-left transition-colors"
                    :class="selected === f.name ? 's-border-accent s-bg-accent-subtle' : 's-border-theme s-bg-surface'"
                    @click="selected = f.name"
                >
                    <component :is="f.icon" class="w-6 h-6" :class="f.fg" />
                    <p class="text-xs font-medium s-text-primary truncate mt-2">{{ f.name }}</p>
                    <p class="text-[11px] s-text-muted">{{ f.size }}</p>
                </button>
            </div>
            <s-card v-else class="mt-3">
                <s-data-table :data="files" :stripe="false" size="small">
                    <s-data-table-column prop="name" label="Name" />
                    <s-data-table-column prop="size" label="Size" width="90px" />
                    <s-data-table-column prop="modified" label="Modified" width="140px" />
                </s-data-table>
            </s-card>
            <p v-if="selected" class="text-sm s-text-secondary mt-3">Selected: <span class="font-mono text-[12px]">{{ selected }}</span></p>
        </DemoStage>
        <DemoSource file="DemoFileManager.vue" />
        <s-toast-container />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { FileText, Image, FileSpreadsheet, FileArchive } from 'lucide-vue-next'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SPageHeader } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'
import { STabs } from '@kundancool/simple-ui'
import { SCard } from '@kundancool/simple-ui'
import { SDataTable } from '@kundancool/simple-ui'
import { SDataTableColumn } from '@kundancool/simple-ui'
import { SToastContainer } from '@kundancool/simple-ui'
import { useToast } from '@kundancool/simple-ui'

const { info } = useToast()
const view = ref('grid')
const selected = ref('')
const files = ref([
    { name: 'gst-certificate.pdf', size: '184 KB', modified: '2 days ago', icon: FileText, fg: 's-text-icon-blue' },
    { name: 'team-offsite.jpg', size: '2.4 MB', modified: '5 days ago', icon: Image, fg: 's-text-icon-purple' },
    { name: 'august-revenue.xlsx', size: '96 KB', modified: '1 week ago', icon: FileSpreadsheet, fg: 's-text-icon-green' },
    { name: 'backup-01.zip', size: '48 MB', modified: '2 weeks ago', icon: FileArchive, fg: 's-text-icon-yellow' },
])

function notify(message) {
    info(message)
}
</script>
