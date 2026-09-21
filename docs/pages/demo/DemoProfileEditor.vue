<template>
    <div>
        <DemoStage title="Live profile editor">
            <div class="grid lg:grid-cols-3 gap-3">
                <s-card>
                    <div class="flex flex-col items-center text-center py-2">
                        <s-avatar :name="form.name || 'New member'" tone="purple" size="xl" />
                        <p class="text-sm font-semibold s-text-primary mt-2">{{ form.name || 'Your name' }}</p>
                        <p class="text-xs s-text-muted">{{ form.role }} · {{ form.location || 'Somewhere' }}</p>
                        <s-tag type="info" size="sm" class="mt-2">{{ form.pronouns || '—' }}</s-tag>
                    </div>
                </s-card>
                <s-card title="Edit profile" class="lg:col-span-2">
                    <div class="grid sm:grid-cols-2 gap-x-4">
                        <s-input v-model="form.name" label="Display name" />
                        <s-input v-model="form.location" label="Location" placeholder="City" />
                    </div>
                    <s-select v-model="form.role" label="Role" :options="roles" option-label="label" option-value="value" />
                    <s-input v-model="form.bio" label="Bio" type="textarea" :rows="3" hint="One or two sentences guests will read." />
                    <div class="flex gap-2">
                        <s-button :loading="saving" @click="save">Save profile</s-button>
                        <s-button variant="secondary" @click="reset">Reset</s-button>
                    </div>
                </s-card>
            </div>
        </DemoStage>
        <DemoSource file="DemoProfileEditor.vue" />
        <s-toast-container />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SCard } from '@kundancool/simple-ui'
import { STag } from '@kundancool/simple-ui'
import { SAvatar } from '@kundancool/simple-ui'
import { SInput } from '@kundancool/simple-ui'
import { SSelect } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'
import { SToastContainer } from '@kundancool/simple-ui'
import { useToast } from '@kundancool/simple-ui'

const { success } = useToast()
const blank = { name: '', location: '', role: 'Manager', bio: '', pronouns: '' }
const form = ref({ name: 'Kundan Kumar', location: 'Bengaluru', role: 'Manager', bio: 'Runs a 12-room boutique stay.', pronouns: 'he/him' })
const saving = ref(false)
const roles = [
    { value: 'Owner', label: 'Owner' },
    { value: 'Manager', label: 'Manager' },
    { value: 'Front desk', label: 'Front desk' },
]

function save() {
    saving.value = true
    setTimeout(() => {
        saving.value = false
        success('Profile updated — preview follows your typing.')
    }, 600)
}

function reset() {
    form.value = { ...blank }
}
</script>
