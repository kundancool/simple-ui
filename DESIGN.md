# Simple UI — Design Guidelines

> Canonical version: `docs/spec/01-design-principles.md`. This file mirrors
> it in friendlier prose; on conflict the spec wins.

Single source of truth for how Simple UI looks, moves and behaves.
Every component in `src/components` follows this document; contributions
must follow it too. Users can read the friendlier version on the docs
“Design guidelines” page.

## 1. Foundations

- **Base unit 4px.** All spacing, sizes and radii are multiples of 4
  (Tailwind steps), except the documented micro exception below.
- **Themes, not colors.** Components reference `var(--s-*)` tokens only —
  never hex values, except the fixed fills listed in §3.
- **Two palettes.** `:root` is light, `.dark` is dark. Both avoid pure
  white and pure black. Every semantic token exists in both.

## 2. Spacing

| Use | Scale |
|---|---|
| Field bottom margin | `mb-4` (16px) on every block form control |
| Label → control | `mb-1.5` (6px) |
| Control → error/hint | `mt-1` (4px) |
| Card body | `px-4 py-4`, `md:px-5 md:py-5` |
| Dialog body | `px-4 py-4`, `md:px-6 md:py-5` |
| Table cells (`default`) | `px-4 py-3` (`small` 12/8, `large` 20/16) |
| Button heights | 24 / 28 / 36 / 40 (`h-6 / h-7 / h-9 / h-10`) |
| Control height | 36px (`--s-control-h`): inputs, selects, date triggers, md buttons, stepper. Compact rows (pagination): 32px (`h-8`) |
| Inline gaps | `gap-1.5`–`gap-3`; section gaps `gap-3`–`gap-4` |

## 3. Color roles

| Token family | Role |
|---|---|
| `text-primary / secondary / muted` | Headings+labels / supporting text / hints, timestamps, empty states |
| `text-placeholder` | Empty-field prompts only (below body contrast on purpose) |
| `accent` fill vs `accent-text` | Fill for solid controls; `-text` for foregrounds and focus indicators |
| `danger / warning / success` | Errors+destructive, pending, confirmed — each with `-hover`, `-subtle`, `-border` |
| `border` | Decorative edges (cards, dividers) |
| `border-subtle` | Inner separators |
| `border-input` | Large text fields (softer: they sit on fills and announce on focus) |
| `border-strong` | Small controls to WCAG 3:1 (switch, checkbox) |
| `surface / surface-raised` | Panels / elevated elements, hovers, input fills |

**Fixed fills (deliberate, both themes):** toast fills, switch knob white,
brand tiles, ANSI viewer terminal palette.

## 4. Typography

- Body/controls: `text-sm`. Labels: `text-sm font-medium`.
- Table headers and section labels: `text-xs font-medium uppercase tracking-wider`.
- Page titles: `text-lg sm:text-xl font-semibold`.
- **Micro exception:** 10–11px only for badges, kbd hints and uppercase
  nav labels — never body text.
- Tabular numerals for money/counts where relevant.

## 5. Radius

| Value | Use |
|---|---|
| 4px `rounded` | Icon-only small controls |
| 6px `rounded-md` | Inputs, selects, buttons, menus, checkboxes |
| 8px `rounded-lg` | Card headers? No — popovers, toasts, icon tiles |
| 12px `rounded-xl` | Cards |
| 16px+ `rounded-2xl` | Dialogs |
| `rounded-full` | Tags, switches, knobs, step circles, avatar-like tiles |

Buttons carry the same 1px border on every variant (transparent on fills)
so all sizes match regardless of the consumer's `box-sizing`.

## 6. Elevation & overlays

- Shadows from tokens only: `sm` cards/inputs, `md` hovers, `lg` overlays.
- Overlay scale: dropdown 100, dialog/popover 200, toast 300 —
  via `var(--s-z-*)`, never literals.
- Scrim: `bg-black/50` + subtle backdrop blur, both themes.
- Teleported popovers carry `data-overlay` so dialog focus traps include them.

## 7. Motion

- `fast` 120ms hovers/color, `base` 180ms enter/leave, `slow` 260ms panels.
- Overlays fade+scale (`s-pop`), backdrops fade, toasts slide from the edge.
- `prefers-reduced-motion` short-circuits everything to near-zero duration
  (never `none`, so `transitionend` still fires).
- Loading reads as *work*: skeleton sweep, never a fading pulse.

## 8. Focus & touch

- Text fields: border → `accent-text` + 3px `accent-subtle` ring.
- Buttons/links/menus: 2px `accent-text` outline, offset 2 (`s-focus-ring`),
  on `:focus-visible` only — never after mouse click.
- Composite controls ring the wrapper (`:focus-within`), never the inner input.
- Minimum hit area 24×24 (`s-touch-target` grows paint-small controls).
- Icon-only buttons are always `inline-flex items-center justify-center` —
  a bare SVG sits on the text baseline and renders off-center otherwise.

## 9. States & content

- Loading: skeleton placeholders that reserve space; spinners only inside
  the control being waited on (button, switch, refresh).
- Empty: muted sentence + optional action, never a bare blank.
- Errors replace hints (one slot), announced with `role="alert"`.
- Destructive actions confirm; hard-to-undo ones retype the name.
- Icon-only controls always carry an accessible name.

## 10. Responsive

- Full-width fields stack on mobile; filter bars wrap (`flex-col md:flex-row`).
- Pagination collapses to prev/next + `n / m`; tables scroll horizontally,
  columns are never hidden (horizontal scroll instead).
- Dialogs are `w-[90%]` with capped max-widths; one size up on `md`.
