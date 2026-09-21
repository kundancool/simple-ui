<template>
    <div>
        <DemoStage title="Live blog">
            <s-section-heading eyebrow="Blog" title="Notes on building admin UI" description="Design notes, engineering deep-dives and release thinking." />
            <s-blog-card
                class="mt-4"
                title="Designing for dark mode"
                excerpt="Tokens, contrast ratios and focus rings that survive the flip — how the whole library re-themes from one variable family."
                author="Kundan"
                date="12 Sep 2026"
                reading-time="8 min read"
                tag="Featured"
            />
            <s-filter v-model="query" placeholder="Search articles…" class="mt-4" @search="noop">
                <s-select v-model="tag" :options="tagOptions" option-label="label" option-value="value" placeholder="All topics" clearable class="w-44" />
            </s-filter>
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <s-blog-card
                    v-for="p in filtered"
                    :key="p.title"
                    :title="p.title"
                    :excerpt="p.excerpt"
                    :author="p.author"
                    :date="p.date"
                    :reading-time="p.readingTime"
                    :tag="p.tag"
                />
            </div>
            <s-empty v-if="!filtered.length" title="No articles found" description="Try a different topic or search term." />
            <s-newsletter class="mt-6" title="New posts in your inbox" description="One email per article, never spam." @submit="subscribed = true" />
        </DemoStage>
        <DemoSource file="DemoBlog.vue" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DemoSource from '../../DemoSource.vue'
import DemoStage from '../../DemoStage.vue'
import { SSectionHeading } from '@kundancool/simple-ui'
import { SBlogCard } from '@kundancool/simple-ui'
import { SFilter } from '@kundancool/simple-ui'
import { SSelect } from '@kundancool/simple-ui'
import { SEmpty } from '@kundancool/simple-ui'
import { SNewsletter } from '@kundancool/simple-ui'

const posts = [
    { title: 'Channel sync in 60 seconds', excerpt: 'How inventory pushes stay consistent across every OTA.', author: 'Priya Nair', date: 'Aug 2026', readingTime: '6 min read', tag: 'Engineering' },
    { title: 'Forms that line up', excerpt: 'One control height across inputs, selects and buttons.', author: 'Kundan', date: 'Aug 2026', readingTime: '3 min read', tag: 'Design' },
    { title: 'GST e-invoices, explained', excerpt: 'What changes for properties this quarter.', author: 'Rahul Das', date: 'Jul 2026', readingTime: '5 min read', tag: 'Billing' },
    { title: 'Rating widgets that convert', excerpt: 'Why we ask after checkout, never during.', author: 'Kundan', date: 'Jul 2026', readingTime: '4 min read', tag: 'Design' },
    { title: 'Webhook retries done right', excerpt: 'Backoff, dead letters and the dashboard that shows both.', author: 'Priya Nair', date: 'Jun 2026', readingTime: '7 min read', tag: 'Engineering' },
]
const tagOptions = [
    { value: 'Design', label: 'Design' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Billing', label: 'Billing' },
]
const query = ref('')
const tag = ref('')
const subscribed = ref(false)

const filtered = computed(() => {
    const q = query.value.trim().toLowerCase()
    return posts.filter((p) => {
        if (tag.value && p.tag !== tag.value) {
            return false
        }
        return !q || `${p.title} ${p.excerpt} ${p.author}`.toLowerCase().includes(q)
    })
})

function noop() {}
</script>
