/**
 * Builds the component registry from `src/components/<dir>/meta.json`.
 *
 * Outputs (single source of truth for docs, llms.txt and the MCP server):
 *   dist/registry.json        — shipped with the npm package
 *   docs/public/registry.json — served by the docs SPA
 *   llms.txt / llms-full.txt  — agent-friendly docs (also shipped)
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))

const componentsDir = join(root, 'src', 'components')
const components = []

for (const dir of readdirSync(componentsDir, { withFileTypes: true })) {
    if (!dir.isDirectory()) {
        continue
    }
    const metaPath = join(componentsDir, dir.name, 'meta.json')
    if (!existsSync(metaPath)) {
        console.warn(`[registry] missing meta.json in ${dir.name}`)
        continue
    }
    const meta = JSON.parse(readFileSync(metaPath, 'utf8'))
    components.push({ dir: dir.name, ...meta })
}

components.sort((a, b) => a.name.localeCompare(b.name))

const registry = {
    package: pkg.name,
    version: pkg.version,
    prefix: 'S',
    install: {
        npm: `npm install ${pkg.name}`,
        setup: `import SimpleUI from '${pkg.name}'\nimport '${pkg.name}/dist/simple-ui.css'\n\napp.use(SimpleUI)`,
        single: `import { SButton } from '${pkg.name}'\nimport '${pkg.name}/dist/simple-ui.css'`,
    },
    theme: {
        strategy: 'Override any --s-* variable. Subtle/border shades derive via color-mix().',
        dark: "Toggle the `dark` class on <html> (see useDark()).",
        example: `:root { --s-accent: #7c3aed; }\n\nimport { setPrimary } from '${pkg.name}'\nsetPrimary('#7c3aed')`,
    },
    components,
}

mkdirSync(join(root, 'dist'), { recursive: true })
writeFileSync(join(root, 'dist', 'registry.json'), `${JSON.stringify(registry, null, 2)}\n`)
mkdirSync(join(root, 'docs', 'public'), { recursive: true })
writeFileSync(join(root, 'docs', 'public', 'registry.json'), `${JSON.stringify(registry, null, 2)}\n`)

const lines = [
    `# ${pkg.name} v${pkg.version}`,
    '',
    `Simple UI — Vue 3 themeable components for dashboards and admin apps.`,
    '',
    '## Install',
    '',
    '```js',
    registry.install.setup,
    '```',
    '',
    '## Components',
    '',
    ...components.flatMap((c) => [
        `### ${c.name}`,
        '',
        c.description,
        '',
        '```vue',
        c.example,
        '```',
        '',
    ]),
    '## Theming',
    '',
    registry.theme.strategy,
    registry.theme.dark,
    '',
    '```css',
    registry.theme.example,
    '```',
    '',
]

writeFileSync(join(root, 'llms.txt'), `${lines.join('\n')}\n`)
writeFileSync(
    join(root, 'llms-full.txt'),
    `# ${pkg.name} v${pkg.version} — full component API\n\n${JSON.stringify(registry, null, 2)}\n`,
)

console.log(`[registry] ${components.length} components → dist/registry.json, docs/public/registry.json, llms.txt`)
