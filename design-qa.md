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
- Browser-rendered implementation: `experience-arcs-implementation.png` (480 × 300 px focused crop).
- Side-by-side comparison: `experience-arcs-comparison.png` (980 × 320 px).
- Context screenshot: `experience-arcs-rows.png` (1440 × 900 px).
- Viewport: 1440 × 900 CSS px at device pixel ratio 1. Source and implementation were compared at native 1× density without density conversion.
- State: homepage scrolled to the desktop Professional Experience graph; two achievement branches visible for one role.

## Evidence

- Full-view comparison: the context screenshot confirms the deeper arcs remain inside the graph column and do not overlap the experience content or section boundary.
- Focused comparison: the combined source/implementation image confirms that both directions leave the spine horizontally, descend exactly 3 cm, and meet the endpoint vertically in a broad quarter-turn. The horizontal reach is intentionally shorter than the reference per the user's follow-up direction.
- Primary behavior tested: page load, scroll to the Experience section, and graph rendering after hot reload. The graph remains decorative and no graph interaction was changed.
- Responsive behavior tested at 390 × 844: all three graph columns remain hidden, all three experience articles remain present, and there is no horizontal overflow.
- Browser console: no errors.
- `npm.cmd run lint -- src/app/page.tsx`: passed.

## Fidelity review

- Fonts and typography: existing portfolio typography and achievement-label hierarchy are unchanged; the source copy is illustrative, so real CMS copy is intentionally retained.
- Spacing and layout rhythm: one-achievement rows measure 8 cm and two-achievement rows measure 9 cm. Origins sit at 1 cm and 2 cm, every endpoint is 3 cm below its origin, every dashed continuation is 1 cm, the last endpoint has 4 cm before the next experience node, and horizontal reach is reduced from about 122 px to 95.8 px.
- Colors and visual tokens: existing blue stroke, node, opacity, and dark-background tokens are unchanged and remain consistent with the reference.
- Image quality and asset fidelity: no raster asset is required for this code-native data visualization; strokes and nodes remain crisp at 1× density.
- Copy and content: live achievement text is intentionally retained and truncation remains unchanged.

## Findings

- [P1] A concurrent edit changed `originCm` from `achievementIndex + 1` to `achievementIndex + 2` after the passing browser capture. The saved source now places origins at 2 cm/3 cm instead of the confirmed 1 cm/2 cm, so the current source no longer matches the verified evidence. Restore the `+ 1` value after the overlapping task stops, then recapture before handoff.

## Comparison history

1. Initial P2: the Bézier control point sat above the branch origin, producing a shallow S-shaped kink. Fixed by restoring horizontal and vertical tangents.
2. Follow-up P2: the first revision dropped only about 44 px and still read as minimal. Fixed by increasing the endpoint offset to about 74 px and lowering the second control point proportionally.
3. Post-fix evidence: `experience-arcs-comparison.png` shows the revised source and implementation arcs with matching depth and curvature.
4. Follow-up polish: extended each dashed continuation from about 15 px to about 42–44 px below the achievement node; the revised comparison confirms the longer graph continuation remains within the available row.
5. Confirmed spacing model: replaced percentage-distributed origins with fixed centimeter geometry, increased the arc drop to 3 cm, set the next-experience clearance to 4 cm, and reduced horizontal reach. Browser measurements confirmed 302.4 px/340.2 px row heights and 113.4 px arc drops at 96 CSS dpi.
6. Blocking source drift: the first-origin value was changed twice by an overlapping edit after verification (`1 cm → 3 cm`, then `1 cm → 2 cm`). The latest saved source is not the passing implementation shown in the screenshots.

## Implementation checklist

- [x] Match the reference arc tangents.
- [x] Place achievement origins at 1 cm and 2 cm from the experience node.
- [x] Increase every vertical arc drop to 3 cm.
- [x] Keep 4 cm between the last achievement endpoint and the next experience.
- [x] Extend the dashed continuation to 1 cm beneath each achievement node.
- [x] Reduce the horizontal distance between the spine and endpoint.
- [x] Keep node positions, colors, labels, and responsive behavior otherwise unchanged.
- [x] Verify in the browser and run targeted lint.

final result: blocked
