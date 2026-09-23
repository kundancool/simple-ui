<template>
    <div>
        <DemoStage title="Live CRUD">
        <s-page-header class="mb-5" title="Team" subtitle="Manage staff accounts and roles." add-text="Invite member" @add="openCreate" />
        <s-card>
            <s-data-table :data="members">
                <s-data-table-column prop="name" label="Name" />
                <s-data-table-column prop="email" label="Email" />
                <s-data-table-column label="Role" width="140px">
                    <template #default="{ row }"><s-tag :type="row.role === 'Admin' ? 'info' : 'default'">{{ row.role }}</s-tag></template>
                </s-data-table-column>
                <s-data-table-column label="Status" width="130px">
                    <template #default="{ row }"><s-tag :type="row.active ? 'success' : 'warning'">{{ row.active ? 'Active' : 'Invited' }}</s-tag></template>
                </s-data-table-column>
                <s-data-table-column label="" width="120px" align="right">
                    <template #default="{ row }">
                        <div class="flex justify-end gap-1">
                            <s-button size="xs" variant="ghost" @click="openEdit(row)">Edit</s-button>
                            <s-button size="xs" variant="ghost" @click="askDelete(row)"><span class="s-text-danger">Remove</span></s-button>
                        </div>
                    </template>
                </s-data-table-column>
            </s-data-table>
        </s-card>

        <s-dialog v-model="dialog" :title="editing ? 'Edit member' : 'Invite member'" width="sm">
            <div class="space-y-4">
            <s-input v-model="form.name" label="Full name" :error="errors.name" />
            <s-input v-model="form.email" label="Email" placeholder="you@acme.test" :error="errors.email" />
            <s-select v-model="form.role" label="Role" :options="roles" option-label="label" option-value="value" />
            <div class="flex items-center gap-2">
                <s-switch v-model="form.active" aria-label="Active immediately" />
                <span class="text-sm s-text-secondary">Active immediately</span>
            </div>
            </div>
            <template #footer>
                <s-button variant="secondary" @click="dialog = false">Cancel</s-button>
                <s-button :loading="saving" @click="save">{{ editing ? 'Save changes' : 'Send invite' }}</s-button>
            </template>
        </s-dialog>

        <s-confirm-by-name-dialog
            v-model="confirmDelete"
            title="Remove member"
            message="They lose access immediately. Type their name to confirm."
            :expected="target?.name ?? ''"
            label="member"
            confirm-text="Remove member"
            :loading="saving"
            @confirm="remove"
        />
        <s-toast-container />
        </DemoStage>
        <DemoSource file="DemoCrud.vue" />
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { SPageHeader } from '@kundancool/simple-ui'
import { SCard } from '@kundancool/simple-ui'
import { SDataTable } from '@kundancool/simple-ui'
import { SDataTableColumn } from '@kundancool/simple-ui'
import { STag } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'
import { SDialog } from '@kundancool/simple-ui'
import { SInput } from '@kundancool/simple-ui'
import { SSelect } from '@kundancool/simple-ui'
import { SSwitch } from '@kundancool/simple-ui'
import { SConfirmByNameDialog } from '@kundancool/simple-ui'
import { SToastContainer } from '@kundancool/simple-ui'
import { useToast } from '@kundancool/simple-ui'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'

const { success } = useToast()

const roles = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Manager', label: 'Manager' },
    { value: 'Support', label: 'Support' },
]

const members = ref([
    { id: 1, name: 'Kundan Kumar', email: 'kundan@acme.test', role: 'Admin', active: true },
    { id: 2, name: 'Priya Nair', email: 'priya@acme.test', role: 'Manager', active: true },
    { id: 3, name: 'Rahul Das', email: 'rahul@acme.test', role: 'Support', active: false },
])

const dialog = ref(false)
const editing = ref(null)
const saving = ref(false)
const confirmDelete = ref(false)
const target = ref(null)
const form = ref({ name: '', email: '', role: 'Support', active: true })
const errors = ref({ name: '', email: '' })

function openCreate() {
    editing.value = null
    form.value = { name: '', email: '', role: 'Support', active: true }
    errors.value = { name: '', email: '' }
    dialog.value = true
}

function openEdit(row) {
    editing.value = row
    form.value = { ...row }
    errors.value = { name: '', email: '' }
    dialog.value = true
}

function save() {
    errors.value = {
        name: form.value.name.trim() ? '' : 'Name is required.',
        email: /.+@.+\..+/.test(form.value.email) ? '' : 'Enter a valid email.',
    }
    if (errors.value.name || errors.value.email) {
        return
    }
    saving.value = true
    setTimeout(() => {
        if (editing.value) {
            Object.assign(editing.value, form.value)
            success('Member updated.')
        } else {
            members.value.push({ id: Date.now(), ...form.value })
            success('Invite sent.')
        }
        saving.value = false
        dialog.value = false
    }, 600)
}

function askDelete(row) {
    target.value = row
    confirmDelete.value = true
}

function remove() {
    members.value = members.value.filter((m) => m !== target.value)
    confirmDelete.value = false
    success('Member removed.')
}
</script>
