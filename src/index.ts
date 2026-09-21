import './styles/main.css'
import * as components from './components'

export * from './components'
export { default as SimpleUIResolver } from './resolver'

/**
 * Plugin options.
 */
export interface SimpleUIOptions {
    /**
     * Component prefix. Default `S` registers `<s-button>`, `<s-input>`…
     * Pass e.g. `{ prefix: 'Tmk' }` for `<tmk-button>` if `S*` ever clashes.
     */
    prefix?: string
}

function registerComponent(app, name, component, prefix) {
    const short = name.replace(/^S/, '')
    app.component(`${prefix}${short}`, component)
    if (prefix === 'S') {
        app.component(name, component)
    }
}

function installable(component) {
    return component
}

/**
 * Full-library install: `app.use(SimpleUI)`.
 * Every component is registered as `S*` (and `<Prefix*>` with a custom prefix).
 */
export function install(app, options: SimpleUIOptions = {}) {
    const prefix = options.prefix ?? 'S'
    for (const [name, component] of Object.entries(components)) {
        if (name.startsWith('S') && component && typeof component === 'object') {
            app.component(name, installable(component))
            if (prefix !== 'S') {
                registerComponent(app, name, component, prefix)
            }
        }
    }
}

const SimpleUI = { install }

export default SimpleUI
