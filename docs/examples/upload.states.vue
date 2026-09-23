<!-- demo: Multiple files and disabled — Batch upload and the paused state. -->
<template>
    <div class="space-y-4 max-w-md">
        <s-upload action="/uploads" accept="image/*" multiple tip="Several PNG or JPG files at once." />
        <s-upload action="/uploads" label="Disabled" disabled tip="Uploads are paused." />
    </div>
</template>

<script setup>
import { SUpload } from '@kundancool/simple-ui'
</script>
