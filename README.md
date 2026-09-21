# Simple UI

Lightweight Vue 3 component library for dashboards and admin apps.

- 61 components: form, data display, feedback, navigation, layout, landing/blog kit, charts
- Theme engine: `--s-*` tokens, light/dark palettes (persisted), runtime overrides
- Per-component ESM + CSS, subpath exports, `SimpleUIResolver` for on-demand loading
- 41 demo pages, docs SPA with live demos, generated registry, `llms.txt`, MCP server for AI agents

## Install

```bash
npm install @kundancool/simple-ui
```

```js
// main.js
import SimpleUI from '@kundancool/simple-ui'
import '@kundancool/simple-ui/dist/simple-ui.css'

app.use(SimpleUI) // <s-button>, <s-input>, …
```

```vue
<s-page-header title="Bookings" add-text="New booking" refreshable @refresh="fetchRows" />
<s-data-table :data="rows" :loading="loading">
  <s-data-table-column prop="booking_no" label="Booking" />
  <s-data-table-column label="Status">
    <template #default="{ row }">
      <s-tag :type="row.status === 'CONFIRMED' ? 'success' : 'warning'">{{ row.status }}</s-tag>
    </template>
  </s-data-table-column>
</s-data-table>
<s-pagination v-model:page="page" :total="total" @change="fetchRows" />
```

## Single component

```js
// tree-shaken from the main entry…
import { SButton } from '@kundancool/simple-ui'
// …or straight from its own file (smallest possible bundle)
import { SButton } from '@kundancool/simple-ui/components/button'
import '@kundancool/simple-ui/dist/simple-ui.css'
```
// Measured: one button ≈ 63 kB (25 kB gzip, mostly Vue) vs ≈ 406 kB for the
// full library. Component `<style>` travels with its subpath file automatically.

## On-demand

```js
// vite.config.js
import Components from 'unplugin-vue-components/vite'
import { SimpleUIResolver } from '@kundancool/simple-ui/resolver'

export default { plugins: [Components({ resolvers: [SimpleUIResolver()] })] }
```

## Theming

```css
:root {
  --s-accent: #7c3aed; /* subtle/border shades follow via color-mix() */
}
```

```js
import { setPrimary, useDark } from '@kundancool/simple-ui'
setPrimary('#7c3aed')
const { toggle } = useDark() // toggles .dark on <html>
```

## Charts

```bash
npm install chart.js vue-chartjs
```

```vue
<s-line-chart :labels="days" :datasets="[{ label: 'Revenue', data: revenue }]" />
```

## Docs & AI

- Docs: `npm run dev:docs` (static build: `npm run build:docs`)
- Agents: hosted MCP + `llms.txt` — see the docs “Build with AI” page and `mcp/DEPLOY.md`.

## Develop

```bash
npm install
npm run build        # registry + library
npm test             # vitest
npm run dev          # watch library rebuilds + docs with HMR
npm run dev:docs     # docs only (run npm run build:lib first after src edits)
```

## Roadmap

- `SMarkdown`, more chart types, locale/i18n provider
