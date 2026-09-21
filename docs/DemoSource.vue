<template>
    <div class="mt-8">
        <DemoBlock :code="code" :title="file" lang="vue" />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import DemoBlock from './DemoBlock.vue'

const props = defineProps({
    /** Demo filename, e.g. "DemoLogin.vue". */
    file: { type: String, required: true },
})

const raws = import.meta.glob('./pages/demo/*.vue', { eager: true, query: '?raw', import: 'default' })
const code = computed(() => raws[`./pages/demo/${props.file}`] ?? '// source unavailable')
</script>
