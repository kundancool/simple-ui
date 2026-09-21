<template>
    <div>
        <DemoStage title="Live product catalogue">
            <s-page-header title="Products" subtitle="Add-ons customers can buy with an order." add-text="New product" @add="openCreate" />
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <s-card v-for="p in products" :key="p.id">
                    <div class="flex items-start justify-between gap-2">
                        <s-tag :type="p.stock > 0 ? 'success' : 'danger'" size="sm">{{ p.stock > 0 ? `${p.stock} in stock` : 'Out of stock' }}</s-tag>
                        <s-switch v-model="p.listed" aria-label="Listed" />
                    </div>
                    <p class="text-sm font-semibold s-text-primary mt-2">{{ p.name }}</p>
                    <p class="text-xs s-text-muted">{{ p.category }}</p>
                    <div class="flex items-center justify-between mt-2">
                        <span class="text-sm font-bold s-text-primary">₹{{ p.price.toLocaleString('en-IN') }}</span>
                        <div class="flex gap-1">
                            <s-button size="xs" variant="ghost" @click="openEdit(p)">Edit</s-button>
                            <s-button size="xs" variant="ghost" @click="remove(p)"><span class="s-text-danger">Delete</span></s-button>
                        </div>
                    </div>
                </s-card>
            </div>
        </DemoStage>
        <s-dialog v-model="dialog" :title="editing ? 'Edit product' : 'New product'" width="sm">
            <s-input v-model="form.name" label="Name" :error="errors.name" />
            <div class="grid grid-cols-2 gap-x-4">
                <s-number-input v-model="form.price" label="Price (₹)" :min="0" />
                <s-number-input v-model="form.stock" label="Stock" :min="0" />
            </div>
            <s-select v-model="form.category" label="Category" :options="categories" option-label="label" option-value="value" />
            <template #footer>
                <s-button variant="secondary" @click="dialog = false">Cancel</s-button>
                <s-button @click="save">Save product</s-button>
            </template>
        </s-dialog>
        <DemoSource file="DemoProducts.vue" />
        <s-toast-container />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SPageHeader } from '@kundancool/simple-ui'
import { SCard } from '@kundancool/simple-ui'
import { STag } from '@kundancool/simple-ui'
import { SSwitch } from '@kundancool/simple-ui'
import { SButton } from '@kundancool/simple-ui'
import { SDialog } from '@kundancool/simple-ui'
import { SInput } from '@kundancool/simple-ui'
import { SNumberInput } from '@kundancool/simple-ui'
import { SSelect } from '@kundancool/simple-ui'
import { SToastContainer } from '@kundancool/simple-ui'
import { useToast } from '@kundancool/simple-ui'

const { success } = useToast()
const categories = [
    { value: 'Accessories', label: 'Accessories' },
    { value: 'Delivery', label: 'Delivery' },
    { value: 'Protection', label: 'Protection' },
]
const products = ref([
    { id: 1, name: 'Welcome bundle', category: 'Accessories', price: 499, stock: 40, listed: true },
    { id: 2, name: 'Priority delivery', category: 'Delivery', price: 1200, stock: 12, listed: true },
    { id: 3, name: 'Extended warranty', category: 'Protection', price: 2500, stock: 0, listed: false },
])

const dialog = ref(false)
const editing = ref(null)
const form = ref({ name: '', price: 0, stock: 0, category: 'Accessories' })
const errors = ref({ name: '' })

function openCreate() {
    editing.value = null
    form.value = { name: '', price: 0, stock: 0, category: 'Food' }
    errors.value = { name: '' }
    dialog.value = true
}

function openEdit(p) {
    editing.value = p
    form.value = { ...p }
    errors.value = { name: '' }
    dialog.value = true
}

function save() {
    errors.value.name = form.value.name.trim() ? '' : 'Name is required.'
    if (errors.value.name) {
        return
    }
    if (editing.value) {
        Object.assign(editing.value, form.value)
        success('Product updated.')
    } else {
        products.value.push({ id: Date.now(), listed: true, ...form.value })
        success('Product created.')
    }
    dialog.value = false
}

function remove(p) {
    products.value = products.value.filter((x) => x !== p)
    success('Product deleted.')
}
</script>
