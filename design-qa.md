# Design QA — landing-page contact CTA

## Reference

Selected visual reference: `Generated image 3 (2).png` — the asymmetric **Open channel** contact layout with a vertical status rail, editorial headline, faint network motif, and compact action area.

## Implementation review

- The existing compact contact panel was replaced with a three-column editorial CTA.
- The headline, status rail, primary `/contact` link, and direct `mailto:` link match the selected structure.
- The layout collapses to stacked content on smaller screens.
- Existing palette, typography, borders, buttons, and contact destination were retained.

## Verification

- `npm.cmd run lint`: passed with three unrelated existing warnings in `src/components/studio/projects/ProjectForm.tsx`.
- Visual browser capture: blocked. The in-app browser could not connect to either local preview port (`ERR_CONNECTION_REFUSED`).
- Production build: incomplete because its process exceeded the 120-second command limit while compiling.

## Final result

blocked

## Follow-up

Open the existing dev server in a browser that can access the local host, then compare the landing-page CTA at desktop and mobile widths against the selected visual and update this report to `passed` after resolving any P0–P2 differences.

---

# Design QA — experience achievement arcs

## Artifacts

- Source visual truth: `C:\Users\YUMESH~1\AppData\Local\Temp\codex-clipboard-cc78c746-71ea-42e6-9870-ba9b0346975a.png` (460 × 278 px).
- Browser-rendered implementation: `experience-arcs-implementation.png` (500 × 320 px focused crop).
- Side-by-side comparison: `experience-arcs-comparison.png` (990 × 340 px).
- Context screenshot: `experience-arcs-gap-4cm.png` (1440 × 900 px).
- Viewport: 1440 × 900 CSS px at device pixel ratio 1.

## Evidence

- Two-achievement rows render at 13 cm (491.33 CSS px).
- The measured origin-to-origin gap is 151.17 CSS px, exactly 4 cm at the standard CSS conversion of 96 px per inch.
- The focused comparison confirms the arcs retain the reference's broad quarter-turn shape and the requested shorter horizontal reach.
- Responsive behavior tested at 390 × 844: all three desktop graph columns remain hidden and there is no horizontal overflow.
- `npm.cmd run lint -- src/app/page.tsx`: passed.

## Findings

- No actionable P0, P1, or P2 issues for the requested 4 cm achievement spacing.

## Implementation checklist

- [x] Set the first achievement origin at 3 cm.
- [x] Set `achievementGapCm` to 4 cm.
- [x] Expand two-achievement rows to 13 cm so the longer spacing fits without overlap.
- [x] Keep the dashed continuation and shortened horizontal reach unchanged.
- [x] Keep the mobile layout unchanged.
- [x] Verify exact browser geometry and targeted lint.

final result: passed
