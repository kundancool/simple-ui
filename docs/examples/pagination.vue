<template>
    <s-pagination v-model:page="page" v-model:per-page="perPage" :total="243" @change="onChange" />
    <p class="text-sm s-text-muted mt-2">Page {{ page }}, {{ perPage }} per page</p>
</template>

<script setup>
import { ref } from 'vue'
import { SPagination } from '@kundancool/simple-ui'

const page = ref(7)
const perPage = ref(10)

function onChange({ page: p, perPage: pp }) {
    page.value = p
    perPage.value = pp
}
</script>
