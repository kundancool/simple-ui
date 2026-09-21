<template>
    <div>
        <DemoStage title="Live roles matrix">
            <s-page-header title="Roles & permissions" subtitle="Toggle access — changes save instantly." />
            <s-card>
                <s-data-table :data="matrix" :stripe="false" size="small">
                    <s-data-table-column prop="ability" label="Capability" />
                    <s-data-table-column v-for="role in roles" :key="role" :label="role" align="center" width="130px">
                        <template #default="{ row }">
                            <s-switch :model-value="row[role]" :aria-label="`${row.ability} for ${role}`" @update:model-value="flip(row, role)" />
                        </template>
                    </s-data-table-column>
                </s-data-table>
            </s-card>
        </DemoStage>
        <DemoSource file="DemoRoles.vue" />
        <s-toast-container />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SPageHeader } from '@kundancool/simple-ui'
import { SCard } from '@kundancool/simple-ui'
import { SDataTable } from '@kundancool/simple-ui'
import { SDataTableColumn } from '@kundancool/simple-ui'
import { SSwitch } from '@kundancool/simple-ui'
import { SToastContainer } from '@kundancool/simple-ui'
import { useToast } from '@kundancool/simple-ui'

const { info } = useToast()
const roles = ['Admin', 'Manager', 'Front desk']
const matrix = ref([
    { ability: 'View bookings', Admin: true, Manager: true, 'Front desk': true },
    { ability: 'Create bookings', Admin: true, Manager: true, 'Front desk': true },
    { ability: 'Refund payments', Admin: true, Manager: true, 'Front desk': false },
    { ability: 'Manage rates', Admin: true, Manager: false, 'Front desk': false },
    { ability: 'Manage team', Admin: true, Manager: false, 'Front desk': false },
])

function flip(row, role) {
    row[role] = !row[role]
    info(`${row.ability} ${row[role] ? 'granted to' : 'revoked from'} ${role}.`)
}
</script>
