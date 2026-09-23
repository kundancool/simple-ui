<template>
    <form
        class="s-form"
        :class="disabled ? 'pointer-events-none opacity-60' : ''"
        :aria-busy="disabled || undefined"
        novalidate
        @submit.prevent="$emit('submit', $event)"
    >
        <slot />
    </form>
</template>

<script setup>
import { ref, toRef } from 'vue'
import { provideFormContext } from '../../composables/formContext'
import { isFieldSize } from '../../utils/fieldSize'

defineOptions({ name: 'SForm' })

const props = defineProps({
    /** `top` stacks the label above the control; `left` puts it in a gutter. */
    labelPosition: { type: String, default: 'top', validator: (v) => ['top', 'left'].includes(v) },
    /** Label gutter width when `labelPosition="left"` (any CSS length). */
    labelWidth: { type: String, default: 'auto' },
    /** Default size for every control in the form. */
    size: { type: String, default: undefined, validator: isFieldSize },
    /** Disables every control and blocks interaction. */
    disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['submit'])

const items = ref([])

function registerItem(item) {
    items.value.push(item)

    return () => {
        const at = items.value.indexOf(item)
        if (at !== -1) {
            items.value.splice(at, 1)
        }
    }
}

/** Bring the first invalid field into view (after a server-side validation pass). */
function scrollToFirstError() {
    const first = items.value.find((item) => item.hasError())
    first?.element()?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

provideFormContext({
    labelPosition: toRef(props, 'labelPosition'),
    labelWidth: toRef(props, 'labelWidth'),
    size: toRef(props, 'size'),
    disabled: toRef(props, 'disabled'),
    registerItem,
    scrollToFirstError,
})

defineExpose({ scrollToFirstError })
</script>

<style>
.s-form {
    display: flex;
    flex-direction: column;
}
</style>
