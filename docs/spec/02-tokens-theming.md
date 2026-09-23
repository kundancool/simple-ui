# 02 — Tokens & Theming

## Token contract

- Source: `src/styles/tokens.css`. Every variable is `--s-*`, every utility
  class is `s-*` — **MUST NOT** collide with Element Plus, Tailwind or app styles.
- Components **MUST** style through tokens/utilities, never literal colors
  (fixed fills in `01` are the only exception).
- Subtle/border shades derive from their base via `color-mix()`, so overriding
  one base re-themes the whole family.

## Palettes

- `:root` is light (off-white backgrounds, dark-teal accent); `.dark` on
  `<html>` (or any ancestor) is dark (near-black surfaces, red-tone accent).
- Consumers toggle with `useDark()` from the package; the choice persists in
  `localStorage` (`simple-ui:theme`), falling back to
  `prefers-color-scheme`. Enforced by `tests/theme.spec.ts`.

## Runtime overrides

```css
:root { --s-accent: #7c3aed; }
```

```js
import { setPrimary, setTheme, useDark } from '@kundancool/simple-ui'
setPrimary('#7c3aed')          // most common override
setTheme({ accent: '#7c3aed' }) // any --s-* token, optionally scoped to an element
const { toggle } = useDark()   // toggles .dark on <html>
```

## Shared geometry

- `--s-control-h: 36px` — inputs, selects, date triggers and md buttons all
  resolve to it, so any form row lines up by construction. `--s-field-h`
  lets a component opt into another step of the size scale.
- `--s-z-dropdown: 100`, `--s-z-dialog/--s-z-popover: 200`, `--s-z-toast: 300`.
- `--s-duration-fast/base/slow`: 120/180/260ms with `--s-ease-*` curves.

## Adding or changing a token

1. Add both palettes in `tokens.css` plus a `s-*` utility if consumers need it.
2. Document the override in this spec if it is public API.
3. Cover persistence/override behavior in `tests/theme.spec.ts`.
