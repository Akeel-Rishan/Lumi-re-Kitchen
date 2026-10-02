# ADR 0004: Restaurant design foundation

Status: accepted for Step 2.1, 2026-10-02.

## Decision

Extend the existing Tailwind 4.3.3 CSS-first setup with one [token source](../../src/styles/tokens.css), explicit public/admin scopes and semantic Tailwind inline aliases. Keep strict TypeScript, dependency versions and application structure. No framework replacement or shared component system.

Use warm ivory, evergreen, dark ink and decorative bronze for the public identity. Admin shares interaction/status roles with light neutral surfaces, compact sans-serif headings and tabular numerals. Use system Georgia and Segoe UI/Arial stacks: the repository contains no reusable licensed local assets; deterministic offline builds take precedence over a font download. No assets are copied from operating-system font folders.

The brand is implemented only on the temporary welcome and existing recovery screens via shared stylesheet rules. Keep all honest demonstration copy. The existing header/footer remain; no new navigation, admin shell, final homepage, badge library or operational feature.

## Evidence and tradeoffs

[Token documentation](../design/design-tokens.md) records reproducible sRGB contrast measurements, including bronze's restriction to decoration. [Type/layout rules](../design/typography-and-layout.md) specify scales and responsive behaviour. System font appearance varies by platform; real-device review remains necessary.

The implementation follows [Tailwind v4 theme-variable guidance](https://tailwindcss.com/docs/theme), using inline aliases for scope-dependent values. Breakpoint defaults are preserved. Explicit semantic bindings at each theme root prevent nested scopes from retaining the wrong theme.

Browser verification covers inherited admin typography/surfaces without an admin route, public reset, dark-preference stability, reduced motion, keyboard focus and 200% root-text reflow. Screenshots support visual inspection without baseline assertions. Existing HTTP/recovery/axe tests remain. Error-boundary invocation remains deferred; shared visual styles are source reviewed without a public crash hook.

## Consequences

Future Step 2.2 components consume semantic roles, preserve portal theme scope, labelled statuses and focus treatment. They must not scatter palette values. Step 2.3 owns navigation/shells. No dependency or licence file is added for system stacks. Native zoom, real assistive technology and cross-platform font rendering remain manual checks. See [progress](../progress.md) for actual command outcomes.
