<template>
    <div>
        <DemoStage title="Live customer survey">
            <div class="max-w-xl mx-auto">
                <s-progress :value="progress" size="sm" />
                <p class="text-xs s-text-muted mt-1 mb-3">Question {{ index + 1 }} of {{ questions.length }}</p>
                <s-card :key="index" :title="current.q">
                    <s-rating v-if="current.kind === 'scale'" v-model="scaleAnswer" @change="answer($event)" />
                    <s-input v-else v-model="text" label="Your answer" placeholder="Type here…" @keyup.enter="answer(text)" />
                    <div class="flex justify-between mt-4">
                        <s-button variant="ghost" size="sm" :disabled="index === 0" @click="index -= 1">Back</s-button>
                        <s-button v-if="current.kind !== 'scale'" size="sm" @click="answer(text)">Continue</s-button>
                    </div>
                </s-card>
                <s-alert v-if="finished" variant="success" title="Thanks!" class="mt-3">Your feedback helps us get better.</s-alert>
            </div>
        </DemoStage>
        <DemoSource file="DemoSurvey.vue" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SRating } from '@kundancool/simple-ui'
import { SProgress } from '@kundancool/simple-ui'
import { SCard } from '@kundancool/simple-ui'
import { SInput } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'
import { SAlert } from '@kundancool/simple-ui'

const questions = [
    { id: 'service', q: 'How satisfied are you with the service?', kind: 'scale' },
    { id: 'staff', q: 'How helpful was the staff?', kind: 'scale' },
    { id: 'note', q: 'Anything we should know?', kind: 'text' },
]
const index = ref(0)
const text = ref('')
const scaleAnswer = ref(0)
const answers = ref({})
const finished = ref(false)

const current = computed(() => questions[index.value])
const progress = computed(() => Math.round(((index.value + (finished.value ? 1 : 0)) / questions.length) * 100))

function answer(value) {
    if (value === '' || value == null) {
        return
    }
    answers.value[current.value.id] = value
    text.value = ''
    scaleAnswer.value = 0
    if (index.value < questions.length - 1) {
        index.value += 1
    } else {
        finished.value = true
    }
}
</script>
