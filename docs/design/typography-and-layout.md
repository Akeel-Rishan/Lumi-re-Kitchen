# Typography and layout

## Font policy and implemented scale

Public editorial family: Georgia, "Times New Roman", serif. Interface/body: "Segoe UI", Arial, Helvetica, sans-serif. No licensed font files are bundled in this repository; these are system references, not redistributed fonts, so no asset licence files or next/font/local loader is needed. No external CSS/font import or build-time font download is allowed. Future properly licensed assets can use the framework local-font loader with the licence included; limit weights. Current stacks may differ across operating systems and need real-device review.

Body uses --size-body (1rem, normally 16px), --leading-body (1.65), regular 400 weight and normal tracking. Weights available: --weight-regular 400, --weight-medium 600, --weight-bold 700. Public heading weight is 400; admin is 600. The following values are implemented tokens, not shared components.

| Role       | Size / public token                                   | Line height                       | Weight                        | Tracking                                  | Intended use                                              |
| ---------- | ----------------------------------------------------- | --------------------------------- | ----------------------------- | ----------------------------------------- | --------------------------------------------------------- |
| Display    | --type-display: clamp(2.5rem, 1.75rem + 3vw, 4.75rem) | --leading-display: 1.12           | heading weight                | --tracking-heading: -0.025em              | One public identity/major heading                         |
| Page       | --type-page: clamp(2rem, 1.5rem + 2vw, 3.5rem)        | --leading-heading: 1.2            | heading weight                | -0.025em                                  | h1 including recovery pages                               |
| Section    | --type-section: clamp(1.5rem, 1.25rem + 1vw, 2.25rem) | 1.2                               | heading weight                | -0.025em                                  | h2                                                        |
| Subheading | --size-subheading: 1.25rem                            | 1.2 for h3; 1.65 for introduction | heading weight / regular body | -0.025em / normal                         | h3 or introductory body                                   |
| Body       | --size-body: 1rem                                     | --leading-body: 1.65              | 400                           | --tracking-body: 0em                      | Essential copy and future controls                        |
| Small      | --size-small: 0.9375rem                               | 1.65                              | 400 or 600 disclosure         | normal                                    | Location and supporting information                       |
| Label      | --size-label: 0.875rem                                | --leading-ui: 1.5                 | 600                           | --tracking-label: 0.08em for eyebrow only | Short category labels; avoid long all-caps text           |
| Caption    | --size-caption: 0.8125rem                             | 1.5                               | 400                           | normal                                    | Nonessential annotation only; not used for essential copy |

Admin overrides display/page/section to 2.25/1.75/1.375rem with interface headings; body remains 1rem. All admin numerals inherit tabular-nums; public currency/time/metrics can explicitly use Tailwind tabular-nums. Numeral alignment does not format values: retain en-GB, GBP and Europe/London.

Type uses rem so text enlargement reflows. Heading balance and overflow-wrap prevent clipping without fixed heights. Introductory copy is 1.25rem. The reservation notice is full body size. Future controls inherit fonts and should remain at least 1rem/16px at default size to avoid unnecessary mobile input zoom. Never use placeholders as labels.

## Geometry and scales

| Tokens                                               | Implemented values / role                                                                    |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| --space-1/2/3/4/5/6/8/10/12/16/24                    | 0.25/0.5/0.75/1/1.25/1.5/2/2.5/3/4/6rem (4px rhythm at default size)                         |
| --width-public / --width-admin                       | 78rem (1248px) / 90rem (1440px); --content-max follows theme                                 |
| --width-reading                                      | 65ch, a maximum, never a fixed page width                                                    |
| --gutter-public                                      | clamp(1rem, 3vw, 2.5rem), approximately 16–40px                                              |
| --gutter-admin                                       | clamp(1rem, 2vw, 2rem), approximately 16–32px                                                |
| --section-space                                      | Public clamp(3rem, 8vw, 6rem); admin --space-8                                               |
| --radius-small / medium                              | 0.25 / 0.5rem; small recovery action corners, no pill/card habit                             |
| --border-thin / emphasis                             | 1px / 2px                                                                                    |
| --target-min                                         | 2.75rem, normally 44px; minimum width and height on actions                                  |
| --shadow-none / raised / overlay                     | none / 0 2px 8px ink at 8% / 0 8px 24px ink at 14%; reserved, not applied to present screens |
| --duration-fast / normal                             | 120ms / 180ms; reduced motion overrides both to 0ms                                          |
| --ease-standard                                      | cubic-bezier(0.2, 0, 0, 1)                                                                   |
| --z-base / sticky / overlay / dialog / notice / skip | 0 / 10 / 20 / 30 / 40 / 50, for future stacking contracts                                    |

Public container subtracts two fluid gutters and caps at content-max. It uses minimum 100svh only to keep the footer low when content is short; it grows freely. There is no fixed viewport height or global overflow-x hiding. Current screens stay single-column at every width.

## Mobile-first layout rules

Use existing Tailwind defaults, in rem: sm 40rem (~640px), md 48rem (~768px), lg 64rem (~1024px), xl 80rem (~1280px). These are available-space boundaries, never device detection.

| Available width  | Rule                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Base below 640px | One column, 16–20px approximate gutters, naturally wrapping headings/header/actions; future forms stack with full usable width |
| sm from 640px    | Keep one column unless content genuinely fits; gutters grow fluidly; short related actions may sit together                    |
| md from 768px    | Current header padding grows from space-6 to space-8; future paired fields only if labels/values and targets fit               |
| lg from 1024px   | Later public two-column compositions may be used; reading text stays capped at 65ch                                            |
| xl from 1280px   | Public width caps at 1248px, whitespace absorbs extra room; admin can use up to 1440px                                         |

Admin must preserve readable data, reachable essential actions and explicit hierarchy on narrow screens. Later wide tables need contained scrolling with accessible labels/focus or a purpose-built compact view. Never shrink a desktop dashboard to fit a phone. Do not implement a table or admin shell here.

## Interaction and accessibility rules

Links have underlines beyond colour. Existing filled recovery actions are visually identifiable controls. Focus uses a 3px evergreen outline, 4px offset and white halo. Keep it visible and unobscured by sticky content/overlays; forced-colours uses Highlight. Selection is white on evergreen. Controls inherit fonts.

Only current motion is the recovery action's background/border colour transition; prefers-reduced-motion reduces duration to zero. No decorative movement or smooth-scroll rule is introduced. Later meaningful motion needs a reduced-motion alternative, not merely faster animation.

Disabled controls need explanatory context and readable text, not blanket opacity. Statuses always include text. Essential control borders must use strong or brand roles, not subtle decorative separators. See [measured contrast](design-tokens.md).

Automated doubled-root-text checks are a reflow probe, not native browser zoom. Review actual 200% browser zoom, focus, text spacing and assistive technology manually across supported platforms. No token system alone proves WCAG conformance.
