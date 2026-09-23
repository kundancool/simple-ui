# 01 — Design Principles

Canonical design rules. `DESIGN.md` mirrors this spec in friendlier prose;
on conflict this file wins.

## Foundations

- **MUST** use the 4px base unit (Tailwind steps) for spacing, sizes and
  radii, except the documented micro exception below.
- **MUST** reference `var(--s-*)` tokens only — never hex values, except the
  fixed fills listed under Color.
- **MUST** support both palettes (`:root` light, `.dark` dark). Neither uses
  pure white or pure black. Every semantic token exists in both.

## Spacing

| Use | Scale |
|---|---|
| Field bottom margin | `mb-4` (16px) on every block form control |
| Label → control | `mb-1.5` (6px) |
| Control → error/hint | `mt-1` (4px) |
| Card body | `px-4 py-4`, `md:px-5 md:py-5` |
| Dialog body | `px-4 py-4`, `md:px-6 md:py-5` |
| Table cells (`default`) | `px-4 py-3` (`small` 12/8, `large` 20/16) |
| Button heights | 24 / 28 / 36 / 40 (`h-6 / h-7 / h-9 / h-10`) |
| Control height | 36px (`--s-control-h`); compact rows 32px (`h-8`) |
| Inline gaps | `gap-1.5`–`gap-3`; section gaps `gap-3`–`gap-4` |

## Color roles

- `text-primary / secondary / muted`: headings+labels / supporting text /
  hints, timestamps, empty states. `text-placeholder` for empty-field prompts only.
- `accent` fill for solid controls; `accent-text` for foregrounds and focus.
- `danger / warning / success`: errors+destructive, pending, confirmed — each
  with `-hover`, `-subtle`, `-border`.
- `border` decorative edges; `border-subtle` inner separators;
  `border-input` large text fields; `border-strong` small controls (WCAG 3:1).
- `surface / surface-raised`: panels / elevated elements, hovers, input fills.
- **Fixed fills (deliberate, both themes):** toast fills, switch knob white,
  brand tiles, ANSI viewer terminal palette.

## Typography

- Body/controls `text-sm`; labels `text-sm font-medium`.
- Table headers and section labels `text-xs font-medium uppercase tracking-wider`.
- Page titles `text-lg sm:text-xl font-semibold`.
- **Micro exception:** 10–11px only for badges, kbd hints and uppercase nav
  labels — never body text.
- Tabular numerals for money/counts where relevant.

## Radius

4px `rounded` icon-only small controls; 6px `rounded-md` inputs, selects,
buttons, menus, checkboxes; 8px `rounded-lg` popovers, toasts, icon tiles;
12px `rounded-xl` cards; 16px+ `rounded-2xl` dialogs; `rounded-full` tags,
switches, knobs, step circles, avatar-like tiles. Every button variant
carries the same 1px border (transparent on fills) so sizes match under any
`box-sizing`.

## Elevation & overlays

- Shadows from tokens only: `sm` cards/inputs, `md` hovers, `lg` overlays.
- Overlay levels via `var(--s-z-*)`, never literals: dropdown 100,
  dialog/popover 200, toast 300.
- Scrim `bg-black/50` + subtle blur, both themes.
- Teleported popovers **MUST** carry `data-overlay` (dialog focus trap).

## Motion

- `fast` 120ms hovers/color, `base` 180ms enter/leave, `slow` 260ms panels.
- Overlays fade+scale (`s-pop`); backdrops fade; toasts slide from the edge.
- `prefers-reduced-motion` short-circuits to near-zero duration (never `none`,
  so `transitionend` still fires).
- Loading reads as *work*: skeleton sweep, never a fading pulse.

## Focus & touch

- Text fields: border → `accent-text` + 3px `accent-subtle` ring.
- Buttons/links/menus: 2px `accent-text` outline, offset 2 (`s-focus-ring`),
  on `:focus-visible` only.
- Composite controls ring the wrapper (`:focus-within`), never the inner input.
- Minimum hit area 24×24 (`s-touch-target` grows paint-small controls).
- Icon-only buttons are always `inline-flex items-center justify-center`.

## States & content

- Loading: skeleton placeholders that reserve space; spinners only inside the
  control being waited on.
- Empty: muted sentence + optional action, never a bare blank.
- Errors replace hints (one slot), announced with `role="alert"`.
- Destructive actions confirm; hard-to-undo ones retype the name.
- Icon-only controls always carry an accessible name.

## Responsive

- Full-width fields stack on mobile; filter bars wrap (`flex-col md:flex-row`).
- Pagination collapses to prev/next + `n / m`; tables scroll horizontally —
  columns are never hidden.
- Dialogs are `w-[90%]` with capped max-widths; one size up on `md`.

## Enforcement

Design drift is caught by behavior tests (`tests/scrutiny.spec.ts`,
`tests/components.spec.ts`) and by review against this spec. Token misuse is
caught by convention — grep for `#[0-9a-fA-F]` in component `<style>` blocks
before committing.
