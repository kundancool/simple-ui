<!-- demo: Block vs inline — Own row, or beside other controls in a row. -->
<template>
    <div class="space-y-4">
        <s-number-input v-model="quantity" label="Block (own row)" :min="1" :max="6" />
        <div class="flex flex-wrap items-end gap-4">
            <s-number-input v-model="items" label="Inline (in a row)" :min="1" :max="4" wrapper="inline" />
            <s-number-input v-model="boxes" label="Inline (in a row)" :min="0" :max="9" wrapper="inline" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { SNumberInput } from '@kundancool/simple-ui'

const quantity = ref(2)
const items = ref(1)
const boxes = ref(0)
</script>
