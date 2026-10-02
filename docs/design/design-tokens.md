# Design tokens

Authoritative source: [src/styles/tokens.css](../../src/styles/tokens.css). [globals.css](../../src/app/globals.css) consumes it after the existing Tailwind 4 import. No JavaScript Tailwind configuration or competing palette is introduced.

## Layers and consumption

Primitive `--palette-*` values and the small scales live once in tokens.css. Semantic roles bind to primitives at `:root`, `[data-theme="public"]` and `[data-theme="admin"]`. The HTML root explicitly uses public. Admin overrides only background, muted surface, heading family/weight/sizes, content width, gutters, section spacing and numeral style; status and interaction colours remain shared. Explicit public islands reset these bindings even inside admin content.

| Semantic property      | Default primitive                  |
| ---------------------- | ---------------------------------- |
| `--background`         | `--palette-ivory` (#f7f4ed)        |
| `--surface`            | `--palette-white` (#ffffff)        |
| `--surface-muted`      | `--palette-warm-muted` (#eeebe3)   |
| `--surface-elevated`   | `--palette-white` (#ffffff)        |
| `--text-primary`       | `--palette-ink` (#202824)          |
| `--text-secondary`     | `--palette-secondary` (#46544c)    |
| `--text-muted`         | `--palette-muted` (#59675e)        |
| `--text-on-brand`      | `--palette-white` (#ffffff)        |
| `--border-subtle`      | `--palette-line` (#d6dbd5)         |
| `--border-strong`      | `--palette-boundary` (#7a877e)     |
| `--brand`              | `--palette-evergreen` (#184c3a)    |
| `--brand-hover`        | `--palette-deep-green` (#103b2d)   |
| `--brand-active`       | `--palette-active-green` (#09291f) |
| `--accent`             | `--palette-bronze` (#927040)       |
| `--focus-ring`         | `--palette-evergreen` (#184c3a)    |
| `--focus-halo`         | `--palette-white` (#ffffff)        |
| `--success-background` | `--palette-success-bg` (#e7f1e9)   |
| `--success-text`       | `--palette-success-ink` (#245637)  |
| `--success-border`     | `--palette-success-ink` (#245637)  |
| `--warning-background` | `--palette-warning-bg` (#fff1d6)   |
| `--warning-text`       | `--palette-warning-ink` (#754b0c)  |
| `--warning-border`     | `--palette-warning-ink` (#754b0c)  |
| `--danger-background`  | `--palette-danger-bg` (#f9eae7)    |
| `--danger-text`        | `--palette-danger-ink` (#8b352a)   |
| `--danger-border`      | `--palette-danger-ink` (#8b352a)   |
| `--info-background`    | `--palette-info-bg` (#e7eff6)      |
| `--info-text`          | `--palette-info-ink` (#285576)     |
| `--info-border`        | `--palette-info-ink` (#285576)     |
| `--neutral-background` | `--palette-cool-muted` (#e9eeeb)   |
| `--neutral-text`       | `--palette-secondary` (#46544c)    |
| `--neutral-border`     | `--palette-boundary` (#7a877e)     |

Admin background is neutral #f3f5f4, muted surface cool-muted #e9eeeb. White is also elevated surface; elevation is optional, not automatic. Border-subtle is decorative only; border-strong is the approved essential boundary on all main light surfaces.

Use `color: var(--text-primary)` or Tailwind `text-text-primary`, `bg-surface`, `border-border-strong`, `font-heading`. Tailwind v4 `@theme inline` maps semantic roles at the consuming element so nested themes work; the default colour palette is cleared to discourage scattered colours. Do not add arbitrary brand hex values in components. Geometry can use existing Tailwind utilities; its spacing unit maps to --space-1. Heading family is --heading-family (distinct from Tailwind's --font-heading namespace).

Future components consume the same roles in both themes. Apply data-theme to an admin layout later. Portalled dialogs must mount inside that scope or explicitly repeat its data-theme on the portal root; document.body does not inherit a nested admin scope. There is no theme switch, dark mode, navigation, shell or badge component in this step. OS dark preference does not override the light palette.

## Measured approved combinations

Ratios use opaque sRGB colours: normalize channels to 0–1; linearize with c/12.92 when c <= 0.04045, otherwise ((c+0.055)/1.055)^2.4; luminance = 0.2126R + 0.7152G + 0.0722B; contrast = (lighter+0.05)/(darker+0.05). Values below are rounded to two decimals, with threshold decisions made before rounding. This follows [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Reproduce with the following JavaScript and values from tokens.css:

```js
function luminance(hex) {
  const [r, g, b] = hex
    .slice(1)
    .match(/../g)
    .map((x) => parseInt(x, 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
```

Ink/secondary/muted map to primary/secondary/muted text. Evergreen is link and focus colour. Boundary is a UI border, not normal text.

| Foreground primitive | Background primitive | Ratio   |
| -------------------- | -------------------- | ------- |
| ink                  | ivory                | 13.75:1 |
| secondary            | ivory                | 7.26:1  |
| muted                | ivory                | 5.42:1  |
| evergreen            | ivory                | 8.96:1  |
| boundary             | ivory                | 3.42:1  |
| ink                  | white                | 15.10:1 |
| secondary            | white                | 7.98:1  |
| muted                | white                | 5.95:1  |
| evergreen            | white                | 9.84:1  |
| boundary             | white                | 3.75:1  |
| ink                  | warm-muted           | 12.68:1 |
| secondary            | warm-muted           | 6.70:1  |
| muted                | warm-muted           | 5.00:1  |
| evergreen            | warm-muted           | 8.26:1  |
| boundary             | warm-muted           | 3.15:1  |
| ink                  | neutral              | 13.79:1 |
| secondary            | neutral              | 7.28:1  |
| muted                | neutral              | 5.44:1  |
| evergreen            | neutral              | 8.99:1  |
| boundary             | neutral              | 3.43:1  |
| ink                  | cool-muted           | 12.87:1 |
| secondary            | cool-muted           | 6.80:1  |
| muted                | cool-muted           | 5.07:1  |
| evergreen            | cool-muted           | 8.39:1  |
| boundary             | cool-muted           | 3.20:1  |
| white                | evergreen            | 9.84:1  |
| white                | deep-green           | 12.46:1 |
| white                | active-green         | 15.57:1 |
| success-ink          | success-bg           | 7.38:1  |
| warning-ink          | warning-bg           | 6.79:1  |
| danger-ink           | danger-bg            | 6.80:1  |
| info-ink             | info-bg              | 6.82:1  |
| secondary            | cool-muted           | 6.80:1  |
| bronze               | ivory                | 4.14:1  |

All primary/secondary/muted text pairs exceed 4.5:1 on all five main surfaces. Links remain underlined, with darker hover/active values. White on brand covers selection and filled actions. Status text/border pairs exceed 4.5:1/3:1 respectively. Neutral statuses use secondary on cool-muted. Evergreen focus exceeds 3:1 on all five surfaces; on a filled evergreen action the white halo supplies a 9.84:1 separation before the outer green outline. Use this two-colour focus treatment rather than a green outline directly against green.

Bronze on ivory is 4.14:1 and is **not approved for normal text**. Its only current use is a decorative notice rule. Subtle separators have no essential boundary role. Do not assume any unlisted foreground/background combination is approved, particularly muted text on brand or arbitrary transparency.

These calculations are token evidence, not full accessibility conformance. Real rendering, focus obscuration, statuses, disabled controls and complete interactions still need review.

## Reservation status presentation (future components)

[Lifecycle](../domain/reservation-lifecycle.md) remains authoritative. Always display the label, even if a suggested icon is used. Icons are meaning suggestions only; no icon dependency or badge implementation is added.

| Internal state | Human-readable label                   | Semantic family | Suggested icon meaning | Where/how to use                                               |
| -------------- | -------------------------------------- | --------------- | ---------------------- | -------------------------------------------------------------- |
| pending        | Awaiting approval — not confirmed      | warning         | clock/waiting          | Request receipt and approval queue; show deadline              |
| confirmed      | Confirmed                              | success         | check                  | Accepted booking details                                       |
| arrived        | Arrived                                | info            | arrival marker         | Staff check-in and booking detail                              |
| seated         | Seated                                 | info            | seat                   | Operational floor/detail; label distinguishes arrived          |
| completed      | Visit completed                        | neutral         | completed check        | Visit history; never imply cleanup is finished                 |
| cancelled      | Cancelled                              | neutral         | cancellation mark      | Booking/history; distinguish who cancelled in detail           |
| declined       | Request not accepted                   | danger          | decision stop          | Decision view with safe explanation                            |
| expired        | Request expired — no booking confirmed | neutral         | elapsed clock          | Request outcome; not a cancellation                            |
| no_show        | Marked as not attended                 | danger          | absence marker         | Staff/history, factual customer notice and correction guidance |

Do not infer occupancy, permissions or transitions from colour. Reuse families, never invent nine competing colours.
