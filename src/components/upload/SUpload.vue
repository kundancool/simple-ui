<template>
    <div :class="inline ? '' : 'mb-4'">
        <label v-if="label" class="block text-sm font-medium s-text-primary mb-1.5">{{ label }}</label>

        <div
            class="s-upload rounded-lg border-dashed s-border-input s-bg-surface-raised px-4 py-5 text-center transition-colors"
            :class="[
                isDisabled ? 'opacity-60 pointer-events-none' : 'cursor-pointer',
                dragging ? 's-upload-active' : '',
            ]"
            role="button"
            tabindex="0"
            :aria-disabled="isDisabled || undefined"
            @click="pick"
            @keydown.enter.prevent="pick"
            @keydown.space.prevent="pick"
            @dragover.prevent="dragging = true"
            @dragleave.prevent="dragging = false"
            @drop.prevent="onDrop"
        >
            <input
                ref="inputRef"
                type="file"
                class="hidden"
                :accept="accept"
                :multiple="multiple"
                :disabled="isDisabled"
                @change="onChange"
            />
            <slot>
                <SIcon name="upload" size="lg" class="mx-auto s-text-muted" />
                <p class="text-sm s-text-secondary mt-2">
                    <span class="s-text-accent font-medium">Choose a file</span> or drag it here
                </p>
            </slot>
            <slot name="tip">
                <p v-if="tip" class="text-xs s-text-muted mt-1">{{ tip }}</p>
            </slot>
        </div>

        <ul v-if="files.length" class="mt-2 space-y-1.5">
            <li v-for="entry in files" :key="entry.id" class="flex items-center gap-2 text-xs">
                <SIcon name="document" size="xs" class="s-text-muted flex-shrink-0" />
                <span class="truncate s-text-secondary flex-1">{{ entry.file.name }}</span>
                <span v-if="entry.status === 'uploading'" class="s-text-muted tabular-nums">{{ entry.progress }}%</span>
                <span v-else-if="entry.status === 'done'" class="s-text-success inline-flex items-center gap-1">
                    <SIcon name="check" size="xs" />Done
                </span>
                <span v-else-if="entry.status === 'error'" class="s-text-danger">Failed</span>
                <button type="button" class="s-field-action" aria-label="Remove file" @click="remove(entry)">
                    <SIcon name="close" size="xs" />
                </button>
            </li>
        </ul>

        <p v-if="errorMessage" class="mt-1 text-xs s-text-danger" role="alert">{{ errorMessage }}</p>
        <p v-else-if="hint" class="mt-1 text-xs s-text-muted">{{ hint }}</p>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import SIcon from '../icon/SIcon.vue'
import { firstValidationError } from '../../utils/validation'

defineOptions({ name: 'SUpload', inheritAttrs: false })

const props = defineProps({
    /** Endpoint receiving the multipart POST. */
    action: { type: String, required: true },
    method: { type: String, default: 'POST' },
    /** Extra multipart fields. */
    data: { type: Object, default: () => ({}) },
    /** Extra request headers, on top of the CSRF token. */
    headers: { type: Object, default: () => ({}) },
    /** Start the request as soon as a file is chosen. */
    autoUpload: { type: Boolean, default: true },
    /** Input `accept` attribute. */
    accept: { type: String, default: '' },
    multiple: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    label: { type: String, default: '' },
    tip: { type: String, default: '' },
    hint: { type: String, default: '' },
    error: { type: [String, Array], default: '' },
    /** Inline mode: no bottom margin. */
    inline: { type: Boolean, default: false },
    /** Called with (response, file) after a successful upload. */
    onSuccess: { type: Function, default: null },
})

const emit = defineEmits(['success', 'error', 'progress', 'change', 'remove'])

const inputRef = ref(null)
const files = ref([])
const dragging = ref(false)
let nextId = 0

const errorMessage = computed(() => firstValidationError(props.error))
const isDisabled = computed(() => props.disabled)

/**
 * Laravel puts the token in a meta tag. Reading it here keeps the component
 * framework-agnostic: pass `headers` instead if your app differs.
 */
function csrfToken() {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? ''
}

function pick() {
    if (!isDisabled.value) {
        inputRef.value?.click()
    }
}

function onChange(event) {
    addFiles(Array.from(event.target.files ?? []))
    event.target.value = ''
}

function onDrop(event) {
    dragging.value = false
    if (isDisabled.value) {
        return
    }
    addFiles(Array.from(event.dataTransfer?.files ?? []))
}

function addFiles(incoming) {
    if (!incoming.length) {
        return
    }
    const selected = props.multiple ? incoming : incoming.slice(0, 1)
    const entries = selected.map((file) => ({ id: ++nextId, file, progress: 0, status: 'idle', response: null }))
    files.value = props.multiple ? [...files.value, ...entries] : entries
    emit('change', selected)

    if (props.autoUpload) {
        entries.forEach(upload)
    }
}

function upload(entry) {
    const body = new FormData()
    body.append('file', entry.file)
    for (const [key, value] of Object.entries(props.data)) {
        body.append(key, value)
    }

    const request = new XMLHttpRequest()
    request.open(props.method, props.action, true)

    const token = csrfToken()
    if (token) {
        request.setRequestHeader('X-CSRF-TOKEN', token)
    }
    for (const [key, value] of Object.entries(props.headers)) {
        request.setRequestHeader(key, value)
    }

    request.upload.onprogress = (event) => {
        if (!event.lengthComputable) {
            return
        }
        entry.progress = Math.round((event.loaded / event.total) * 100)
        emit('progress', entry.progress, entry.file)
    }

    request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
            entry.status = 'done'
            entry.progress = 100
            let response = request.responseText
            try {
                response = JSON.parse(request.responseText)
            } catch {
                // Non-JSON responses are passed through as text.
            }
            entry.response = response
            props.onSuccess?.(response, entry.file)
            emit('success', response, entry.file)
            return
        }
        entry.status = 'error'
        emit('error', request, entry.file)
    }

    request.onerror = () => {
        entry.status = 'error'
        emit('error', request, entry.file)
    }

    entry.status = 'uploading'
    request.send(body)
}

function remove(entry) {
    files.value = files.value.filter((item) => item !== entry)
    emit('remove', entry.file)
}

/** Upload the queued files when autoUpload is off. */
function submit() {
    files.value.filter((entry) => entry.status === 'idle').forEach(upload)
}

/** Clears the queue. */
function clear() {
    files.value = []
}


defineExpose({ submit, clear, files, pick })
</script>

<style>
.s-upload-active {
    border-color: var(--s-accent-border);
    background-color: var(--s-accent-subtle);
}
</style>
