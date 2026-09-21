<template>
    <div class="relative flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <template v-for="section in items" :key="section.name || section.label">
            <div v-if="section.children && section.children.length > 0">
                <button
                    :title="collapsed ? section.label : undefined"
                    class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors s-text-secondary s-menu-section"
                    :class="collapsed ? 'justify-center' : ''"
                    :aria-expanded="!collapsed && !!expanded[section.name]"
                    @click="toggleSection(section)"
                >
                    <component :is="section.icon" v-if="section.icon" class="w-5 h-5 flex-shrink-0" />
                    <span v-if="!collapsed" class="truncate flex-1 text-left">{{ section.label }}</span>
                    <svg
                        v-if="!collapsed"
                        class="w-4 h-4 flex-shrink-0 transition-transform duration-200"
                        :class="expanded[section.name] ? 'rotate-180' : ''"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                <div
                    v-if="!collapsed"
                    class="grid transition-[grid-template-rows] duration-200 ease-out"
                    :style="{ gridTemplateRows: expanded[section.name] ? '1fr' : '0fr' }"
                >
                    <div class="overflow-hidden">
                        <div class="ml-3 pl-3 border-l s-border-theme space-y-0.5">
                            <component
                                :is="linkTag"
                                v-for="item in section.children"
                                :key="item.name || item.to"
                                v-bind="linkAttrs(item)"
                                class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors s-menu-item"
                                :class="isActive(item) ? 's-bg-accent-subtle s-text-accent font-medium' : 's-text-secondary'"
                                @click="navigate(item)"
                            >
                                <component :is="item.icon" v-if="item.icon" class="w-4 h-4 flex-shrink-0" />
                                <span class="truncate">{{ item.label }}</span>
                            </component>
                        </div>
                    </div>
                </div>
            </div>
            <component
                :is="linkTag"
                v-else
                v-bind="linkAttrs(section)"
                :title="collapsed ? section.label : undefined"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors s-menu-item"
                :class="[
                    isActive(section) ? 's-bg-accent-subtle s-text-accent font-medium' : 's-text-secondary',
                    collapsed ? 'justify-center' : '',
                ]"
                @click="navigate(section)"
            >
                <component :is="section.icon" v-if="section.icon" class="w-5 h-5 flex-shrink-0" />
                <span v-if="!collapsed" class="truncate">{{ section.label }}</span>
            </component>
        </template>
    </div>
</template>

<script setup>
/**
 * Generic sidebar navigation. Router-agnostic: pass `linkTag` (e.g. your
 * app's RouterLink) or fall back to plain anchors; `activePath` drives
 * highlighting and auto-expansion.
 */
import { ref, watch } from 'vue'

defineOptions({ name: 'SSidebarMenu' })

const props = defineProps({
    /** [{ name?, label, icon?, to?, children?: [{ name?, label, icon?, to }] }] */
    items: { type: Array, required: true },
    collapsed: { type: Boolean, default: false },
    /** Current path — highlights the match and auto-expands its section. */
    activePath: { type: String, default: '' },
    /** Component used for links. Defaults to a plain anchor. */
    linkTag: { type: [String, Object, Function], default: 'a' },
    /** Extra attrs merged into every link (e.g. router custom props). */
    linkProps: { type: Function, default: null },
})

const emit = defineEmits(['navigate'])

const expanded = ref({})

function linkAttrs(item) {
    if (typeof props.linkProps === 'function') {
        return props.linkProps(item)
    }
    return props.linkTag === 'a' ? { href: item.to ?? '#' } : { to: item.to }
}

function isActive(item) {
    return !!item.to && (props.activePath === item.to || props.activePath.startsWith(`${item.to}/`))
}

function navigate(item) {
    emit('navigate', item)
}

function toggleSection(section) {
    if (props.collapsed) {
        if (section.children?.length) {
            navigate(section.children[0])
        }
        return
    }
    expanded.value[section.name] = !expanded.value[section.name]
}

watch(
    () => props.activePath,
    (path) => {
        for (const section of props.items) {
            if (section.children?.some((child) => child.to && (path === child.to || path.startsWith(`${child.to}/`)))) {
                expanded.value[section.name] = true
            }
        }
    },
    { immediate: true },
)
</script>

<style>
.s-menu-section:hover {
    background-color: var(--s-surface-raised);
    color: var(--s-text-primary);
}
.s-menu-item:hover {
    background-color: var(--s-surface-raised);
    color: var(--s-text-primary);
}
.s-menu-item.s-bg-accent-subtle:hover {
    background-color: var(--s-accent-subtle);
    color: var(--s-accent-text-hover);
}
</style>
