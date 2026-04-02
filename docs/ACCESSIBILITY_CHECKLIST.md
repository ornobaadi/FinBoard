# Accessibility Check Log

This checklist is used for manual verification before demo submission.

## Contrast

- [x] Primary text on card backgrounds remains readable in light mode
- [x] Primary text on card backgrounds remains readable in dark mode
- [x] Status chips (safe/watch/risk, pending/completed) include text, not color-only meaning

## Heading Hierarchy

- [x] Page title appears at top of each route and defines primary context
- [x] Section titles follow route title and remain consistent across breakpoints

## Focus Order and Keyboard Access

- [x] Keyboard tab order matches visual flow in dashboard and transactions
- [x] Sort header buttons are keyboard focusable with visible focus ring
- [x] Mobile nav links are keyboard focusable with focus-visible styles
- [x] Shortcut keys do not trigger while typing in form controls

## Screen Reader Labels

- [x] Icon-only controls have aria-label
- [x] Filter controls include aria-label where no visible label exists
- [x] Undo toast uses aria-live="polite"

## Motion and Reduced Motion

- [x] Entry animations disabled under prefers-reduced-motion
- [x] Animated KPI numbers return static values under reduced motion

