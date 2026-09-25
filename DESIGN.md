# LNWJUD Watcher Design System

## Direction

Mode: **Operate**.

The interface must prioritize scanability and reliable status comprehension. Branding should make the product memorable without competing with live state.

## Brand assets

- Dark hero: `/brand/lnwjud-watcher-logo-dark.png`
- Transparent master: `/brand/lnwjud-watcher-logo-transparent.png`
- Mark-only derivative: `/brand/lnwjud-watcher-mark.png`

Do not stretch, skew, recolor, or regenerate these inside the application.

## Typography

Primary: **Prompt**, self-hosted/bundled through the application build.

Use Prompt for Thai and Latin so bilingual layouts keep one typographic voice. Prefer 400/500/600/700 weights only.

## Color roles

- Ink: near-black / deep navy backgrounds.
- Surface: raised graphite/navy panels with subtle warm borders.
- Gold: primary brand/selection/highlight.
- Warm white: primary text.
- Muted slate: secondary information.
- Green: healthy/running/done.
- Violet: analyzing/thinking.
- Blue/cyan: verifying/live transport.
- Amber: waiting/degraded.
- Red: blocked/error.

Status colors must remain semantic and should never be used as decorative brand colors.

## Shape and depth

- Medium radii, not pill-everything.
- Thin warm-gold focus/active accents.
- Subtle gradients and controlled glows only around brand/live indicators.
- Avoid glassmorphism layers that reduce text contrast.
- Avoid generic dashboard grid monotony; use hierarchy and state density instead.

## Navigation

Desktop: branded side rail + content workspace.

Mobile: bottom navigation above safe area, max five primary destinations.

Primary destinations:
- Overview
- Goals
- Agents
- Activity
- Settings

Onboarding is a separate first-run flow, not a permanent nav item.

## Responsive rules

- No horizontal scrolling from content.
- Long goal IDs, task text, evidence, URLs and Thai copy must wrap.
- Bottom navigation must never cover the last card/action.
- Respect `env(safe-area-inset-*)`.
- Forms must remain usable with mobile keyboard open.
- Minimum target size 44px on touch devices.
- Tablet widths may switch between side rail and bottom nav based on available content width, not UA detection.

## Motion

- Fast state transitions only.
- Respect `prefers-reduced-motion`.
- Never animate continuously just to look live.
- Live state is communicated by timestamp/status first, motion second.

## Accessibility

- Keyboard usable primary flows.
- Visible focus rings.
- Text alternatives for status/icon-only controls.
- Color is never the only carrier of status.
- Contrast must remain readable in both dark branded surfaces and lighter content states.

## Copy

Short, operational, and explicit. Never call observable summaries hidden reasoning. The UI may say “Analyzing evidence” only when it is an emitted observable state from LNWJUD.
