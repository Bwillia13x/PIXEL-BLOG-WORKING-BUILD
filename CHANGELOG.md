### Fix – layout spacing

- Introduced `HeaderSpacer` component that dynamically sets `--nav-height` CSS variable based on the real nav-bar height and injects an invisible spacer to push page content below the fixed nav-bar.
- Removed hard-coded top padding in `app/layout.tsx` and inserted `HeaderSpacer` right after `ResponsiveHeader`.
- Extended Tailwind spacing scale with `nav` token (`var(--nav-height)`).
- Added unit test (`__tests__/layout.test.tsx`) and Playwright test (`tests/e2e/layout-spacing.spec.ts`) ensuring headings are rendered below the nav-bar.