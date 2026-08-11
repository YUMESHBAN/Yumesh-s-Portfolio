# Design QA — landing-page contact CTA

## Reference

Selected visual reference: `Generated image 3 (2).png` — the asymmetric **Open channel** contact layout with a vertical status rail, editorial headline, faint network motif, and compact action area.

## Implementation review

- The existing compact contact panel was replaced with a three-column editorial CTA.
- The headline, status rail, primary `/contact` link, and direct `mailto:` link match the selected structure.
- The layout collapses to stacked content on smaller screens.
- Existing palette, typography, borders, buttons, and contact destination were retained.
- The section's desktop footprint, headline, grid, spacing, and background motif were reduced by approximately 10%.
- The static network icon was replaced with a circuit SVG that drifts continuously while two signal traces and their nodes animate on staggered eight-second loops.
- `prefers-reduced-motion` disables all contact-network animation and preserves a readable static motif.
- The action column now matches the button's full 18rem width, removing the right-edge crop.
- Three independently scheduled signal paths now terminate at the shared circuit endpoint beside Contact me. Each arrival triggers a brief button scale and glow before returning to its normal state.
- The shared endpoint is aligned with the desktop button center: the SVG's 285/420 horizontal coordinate in a 28rem graphic lands 9rem from the container's right edge, matching the center of the 18rem action column.
- Signals now use three concurrent, randomly timed schedulers and a four-second travel duration; each pulse selects an available complete route at runtime.

## Verification

- Focused source inspection: passed; the JSX, SVG paths, animation selectors, random scheduling controller, button callback, and reduced-motion fallback are present and internally consistent.
- The previous targeted ESLint pass covered the initial controller; the latest targeted ESLint attempt exceeded the 120-second command limit without reporting an error.
- Local preview and visual browser capture: blocked. The dev command did not bind to the unused preview port `3017`, and the in-app browser received `ERR_CONNECTION_REFUSED`.

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

---

# Design QA - Works editorial index and project stories

## Artifacts and comparison target

- Design source of truth: `C:\Users\Yumesh Ban\.codex\visualizations\2026\08\04\019fcb33-aacb-7d22-9d15-e0ab766023f0\05-home-top.png` and `C:\Users\Yumesh Ban\.codex\visualizations\2026\08\04\019fcb33-aacb-7d22-9d15-e0ab766023f0\04-about-top.png`.
- Desktop implementation: `C:\Users\Yumesh Ban\.codex\visualizations\2026\08\04\019fcb33-aacb-7d22-9d15-e0ab766023f0\08-works-desktop-top.png` and `09-works-desktop-story.png` at a 1440 x 900 CSS viewport.
- Tablet implementation: `10-works-tablet-top.png` at a 768 x 1024 CSS viewport.
- Mobile implementation: `11-works-mobile-top.png` and `12-works-mobile-story.png` at a 390 x 844 CSS viewport.
- Route and state: `/works`, default hero, first project story, active Works navigation.

## Evidence

- The Home, About, Works hero, desktop project story, mobile hero, and mobile story captures were reviewed together in one comparison pass.
- Works preserves the established Geist display/body pairing, near-black surface, blue mono accents, thin divider system, square evidence framing, sticky header, and restrained gradients.
- Six projects render in CMS order. The numbered index, metadata band, alternating desktop story composition, text-led missing-media composition, and closing invitation retain a clear editorial hierarchy.
- At 1440, 768, and 390 CSS px, document width remained within the viewport with no horizontal overflow. The project image precedes the story copy on mobile.
- All six index rows measure 64 px high on mobile. Project and closing CTAs measure 46 px high. The initial 20 px Explore link target was increased to a 44 px minimum height.
- Heading order is one `h1`, followed by project and closing `h2` headings. The project image uses CMS-authored alternative text, and the five projects without authentic media use the required text-led fallback rather than a fake screenshot.
- Works is active on both the index and `/works/[slug]`. Focus-visible rings are present on index links and shared button/link styles. Reduced-motion rules disable section entrances and image transitions.
- `/works` and all six `/works/[slug]` routes returned 200. `/selected-work`, `/projects`, and `/projects/merry-crochets` returned 308 with their exact `/works` replacements. The rendered sitemap contains seven Works URLs and no legacy entries.
- No Works-specific browser runtime error appeared during the rendered index pass. The active dev server did report unrelated stale Turbopack cache errors while compiling legacy routes and an existing About interaction error.
- Targeted lint passed for the new Works files and the route/navigation/SEO migration files. The production build attempt exceeded five minutes while the existing dev process held the same `.next` workspace.

## Findings and comparison history

1. P2 accessibility: the hero's Explore link had a 20 px mobile hit area. Fixed by adding a 44 px minimum target while preserving its inline visual treatment.
2. Accepted content dependency: only Merry Crochets currently has authentic 16:10 project media. The other five projects deliberately render as full-width editorial records until their requested Sanity screenshots and alt text are supplied.
3. No remaining actionable P0, P1, or P2 visual issues in the implemented Works index or first project story.

## Hero height correction

- Source visual truth: `C:\Users\YUMESH~1\AppData\Local\Temp\codex-clipboard-e966977c-9d1f-418d-bf07-8b1fb67279fe.png` (1512 x 768 px including browser chrome; approximately 1512 x 720 CSS px of page content at 1x density).
- Corrected implementation: `C:\Users\Yumesh Ban\.codex\visualizations\2026\08\04\019fcb33-aacb-7d22-9d15-e0ab766023f0\13-works-hero-height-fixed.png` at a 1512 x 720 CSS viewport and 1x density.
- Mobile regression capture: `14-works-hero-height-fixed-mobile.png` at 390 x 844 CSS px and 1x density.
- State: `/works`, initial scroll position, settled hero entrance animation.
- Full-view comparison: the source and corrected desktop implementation were reviewed together. The source hero measured about 1066 px tall in a 720 px viewport and its heading measured about 492 px, pushing the metadata and CTA below the fold. The corrected height-aware title measures about 209 px, the six-item index ends at 625 px, and the CTA ends at 663 px.
- Focused comparison was unnecessary because the full source and implementation captures keep the complete hero typography, metadata band, index, and bottom boundary legible at matched proportions.
- Typography: Geist, weight, tracking, and line-height remain unchanged; only the display size now responds to both viewport width and height.
- Spacing and layout: hero padding and internal vertical gaps were reduced without changing the two-column desktop grid or content order.
- Colors, imagery, icons, and copy are unchanged.
- Mobile verification retains a 55.2 px display size, all six index links, and no horizontal overflow at 390 x 844.

Comparison history: P1 viewport overflow in the supplied short-desktop capture was fixed with height-aware display type and tighter hero-only spacing. The post-fix matched capture contains the complete hero within the viewport with no remaining actionable P0, P1, or P2 issue.

final result: passed

---

# Design QA - About education result breakdown and supporting record panel

## Artifacts

- Source visual truth: `C:\Users\YUMESH~1\AppData\Local\Temp\codex-clipboard-53e880c5-9899-473b-accb-c26c7339f4bb.png` (1365 x 568 px), focused on the supporting education detail area.
- Browser-rendered implementation: `E:\Yumesh Ban\Projects\Yumesh-s-Portfolio\education-result-rows-detail.png` (1265 x 720 px) at 1265 x 720 CSS px, 1x density.
- Responsive browser check: 375 x 844 CSS px, 1x density.
- Route and state: `http://localhost:3000/about`, two visible Bachelor result rows and the supporting +2 education entry.

## Comparison evidence

- Full-view comparison: both artifacts were opened together. The implementation retains the dark surface, thin dividers, blue micro-labels, and two-record academic hierarchy from the source.
- Focused comparison: the source's highlighted supporting detail was compared with the implementation's `Academic note` panel. The source has a small, unbounded summary and chips; the implementation intentionally increases the summary to `text-lg`, adds a subtle border, and makes the chips more legible, as requested.

## Findings

- No actionable P0, P1, or P2 issues.
- [P3] The desktop comparison has different page crops because the source is a cropped reference while the implementation capture includes the fixed navigation. This does not affect the education content region.

## Fidelity review

- Fonts and typography: Bachelor proof remains prominent; the supporting summary and result labels are larger and easier to scan without competing with the qualification title.
- Spacing and layout rhythm: the result breakdown sits beneath the primary proof with a clear divider; two columns collapse to individual full-width rows on mobile.
- Colors and visual tokens: existing black, white, muted-blue, and thin-divider tokens are retained; no new palette was introduced.
- Image quality and asset fidelity: the section contains no visual image assets.
- Copy and content: each shown result reads directly from Sanity, including its label, percentage, and optional note. The count only includes visible result rows.

## Comparison history

1. The previous About page ignored `showResultEntries`, so manually entered results could not appear publicly.
2. Added a conditional result breakdown controlled by the education-level toggle. Normalized content already excludes individual rows whose Studio `Show` toggle is off.
3. Enlarged and structured the supporting education detail into an `Academic note` panel with readable achievement chips.
4. Post-fix browser evidence confirms two rendered result rows, no console warnings or errors, and no mobile horizontal overflow (`375 / 375` CSS px).

## Implementation checklist

- [x] Make the education-level individual-result toggle affect `/about`.
- [x] Respect each result row's individual visibility setting.
- [x] Show result labels, optional notes, and percentages in a responsive breakdown.
- [x] Increase the highlighted supporting-entry text size and visual structure.
- [x] Verify desktop and mobile rendering, TypeScript, and ESLint.

final result: passed

---

# Design QA - Contact SVG pulse alignment

## Implementation review

- Blip traversal increased from 4 seconds to 7 seconds; spawn timing remains randomized to retain independent signals.
- The circuit SVG now measures the Contact me link and places its endpoint at the link's top-center coordinate on desktop.
- Whole-graph drift was removed so that endpoint remains attached while blips move.

## Verification status

- TypeScript `tsc --noEmit --pretty false`: passed (exit 0).
- Homepage route: HTTP 200 from the active Next development server.
- Visual capture: blocked because neither in-app browser navigation nor the Chrome browser connection was available to inspect the local server.

final result: blocked

---

# Design QA - About stack active-proof target correction

## Artifacts and state

- Reference: `C:\Users\Yumesh Ban\.codex\generated_images\019fc87f-83ca-7810-99bb-08582fa41f03\exec-7bc44519-8e25-4574-9006-93544ecc615f.png`.
- Browser-rendered implementation: `stack-proof-index-final.png` at a 1440 x 1024 desktop viewport.
- Side-by-side comparison: `stack-proof-index-comparison.png`.
- State: About stack disclosure closed; marquee moving; active-proof target showing the default CMS-ordered skill.

## Evidence

- The right-side element is now a deliberate continuation of the marquee rail: count above, radar centered on the rail, active technology in the center, and `ACTIVE PROOF` below.
- The marquee viewport reserves a dedicated desktop lane for the target, preventing moving skills from passing beneath it.
- The raster radar asset is radially masked and screen-blended so its original black rectangle does not appear as a separate tile.
- The target updates from the same active, focused, hovered, or pinned skill state as the proof disclosure.
- Browser console: no errors or warnings.
- Targeted ESLint: passed.
- TypeScript with `tsc --noEmit`: passed.
- Production build: intentionally not run, per request.

## Fidelity review

- Typography: count and active-proof label use the established blue mono treatment; section copy remains unchanged.
- Spacing and layout: radar scale and lane placement now follow the reference, with clear separation from the final visible marquee item.
- Colors: dark background, cool-blue rail, rings, dots, and labels match the existing About-page tokens.
- Image quality: the existing full-resolution radar asset is used without stretching or a visible rectangular boundary.
- Copy: unchanged. The live count is `16` rather than the concept's `06` because the implementation reflects all CMS-published proven skills.

## Comparison history

1. P1: the prior radar appeared as a detached decorative tile. Fixed by integrating it into the marquee rail and adding the active proof count, center logo, and label.
2. P2: the radar asset's rectangular background remained visible. Fixed with a radial mask and screen blend.
3. P2: the moving marquee overlapped the target. Fixed by reserving a 53rem desktop marquee lane and sizing the target to 16.5rem.
4. No remaining actionable P0, P1, or P2 issues in the corrected right-side visual.

final result: passed

---

# Design QA - About closing invitation (current)

## Comparison target

- Source visual truth: `C:\Users\Yumesh Ban\.codex\generated_images\019fc11e-826a-7fb2-ae35-8db15bc59ec7\exec-0f43a0c0-18ec-484b-a647-a98beccdc4e6.png`
- Intended implementation: `/about`, closing invitation section.
- Target viewport: desktop, 1728 × 910 source image.
- State: default, with profile availability present.

## Implementation applied

- Replaced the previous contained CTA with the selected editorial composition: mono eyebrow, oversized two-line statement, blue emphasis, a full-width rule, primary work action, contact action, and availability indicator.
- Preserved existing `/selected-work` and `/contact` routes, CMS-driven availability text, the global footer, and mobile stacking.

## Evidence and blocker

- Source visual was opened and inspected.
- Browser-rendered implementation screenshot: unavailable. The newly started local Next development server accepts the connection on port 3000 but did not return `/about` within repeated 10–15 second browser and HTTP timeouts.
- TypeScript validation also exceeded the two-minute process timeout in this workspace; no diagnostic output was produced.
- A same-viewport visual comparison cannot be completed without a rendered implementation capture.

## Required fidelity surfaces

- Fonts and typography: implemented from the existing project typography; browser verification blocked.
- Spacing and layout rhythm: implemented to the selected reference’s large statement and action-rail structure; browser verification blocked.
- Colors and visual tokens: uses existing black, white, and blue project tokens; browser verification blocked.
- Image quality and asset fidelity: no raster or illustration assets are present in the selected reference.
- Copy and content: uses the selected heading and existing CMS availability value; browser verification blocked.

## Implementation checklist

- [x] Apply the selected composition to the About closing invitation.
- [x] Preserve routes and availability fallback behavior.
- [ ] Capture `/about` at the desktop target viewport once the local server responds.
- [ ] Compare source and implementation screenshots, then resolve any P0/P1/P2 differences.

final result: blocked

---

# Design QA - Compact About stack marquee with proof disclosure

## Artifacts

- Source visual truth: `C:\Users\YUMESH~1\AppData\Local\Temp\codex-clipboard-264c6608-5d2d-4fd3-a8eb-dc24b52d2924.png` (1899 x 828 px).
- Closed desktop implementation: `stack-marquee-implementation-1440-closed.png` (1321 x 891 captured px from a 1440 x 900 CSS viewport at 1x density).
- Open desktop proof state: `stack-marquee-implementation-1440.png` (1321 x 891 px).
- Mobile proof state: `stack-marquee-implementation-mobile.png` (375 x 812 captured px from a 390 x 844 CSS viewport at 1x density).
- Focused side-by-side comparison: `stack-marquee-design-comparison.png` (1900 x 435 px). The source was proportionally scaled to 950 px wide; the implementation section was cropped to 1321 x 605 and proportionally scaled to the same comparison width.
- Route: `/about`. The detailed landing-page stack remains unchanged.

## Evidence

- Full-view comparison confirms the selected dark editorial composition, mono eyebrow, single-line desktop display heading, connected circular technology marks, supporting copy, and technical radar motif.
- The implementation intentionally uses every CMS-ordered skill with proof rather than the seven example technologies shown in the concept.
- Browser interaction checks confirmed opening Next.js proof sets `aria-expanded="true"`, ArrowRight previews React, Escape clears the active disclosure, and the close button returns Next.js to `aria-expanded="false"` without reopening the panel.
- The proof panel renders CMS-backed project imagery, title, context, description, three highlights, and project link. Mobile collapses the panel to one column.
- Responsive browser checks found no document overflow at 1024 px or 390 px. The radar is hidden below the desktop breakpoint.
- Focus, pointer hover, and an open or pinned proof pause the marquee. Pointer preview uses the same active state through `onPointerEnter`; the in-app browser did not expose a reliable synthetic pointer-enter state for separate capture.
- Reduced-motion CSS removes the animation and duplicate sequence, disables disclosure transitions, and leaves a manually scrollable primary list.
- `npx.cmd tsc --noEmit`: passed.
- Targeted ESLint for `compact-stack-marquee.tsx` and `about/page.tsx`: passed.
- The full repository lint remains blocked by the pre-existing `react-hooks/immutability` error in `stack-scroll-experience.tsx`; that landing-page component was intentionally left untouched.
- Production build was not run, per user instruction.

## Fidelity review

- Fonts and typography: existing Geist sans/mono tokens are preserved. The final desktop heading scale was tightened after comparison so the copy holds on one line with proportions close to the source.
- Spacing and layout rhythm: the eyebrow, heading, marquee, proof disclosure, and supporting copy follow the reference hierarchy while fitting the existing About-page container.
- Colors and visual tokens: the implementation reuses the portfolio's near-black surface, white display type, muted body text, pale-blue dividers, and focus treatment.
- Image quality and asset fidelity: `public/images/stack-radar.png` is a generated 512 x 512 RGBA asset matching the source motif. CMS/project images and existing technology logos remain sharp and unmodified.
- Copy and content: fixed section copy matches the selected direction; proof content remains CMS-driven.
- Accessibility: one marquee copy is keyboard-accessible, the visual duplicate is removed from the accessibility tree, roving focus supports ArrowLeft/ArrowRight/Home/End, disclosure buttons expose `aria-expanded`/`aria-controls`, Escape and the close button restore focus, and reduced motion is supported.

## Findings and comparison history

1. Initial P2: the display heading wrapped at desktop width. Fixed by tightening the maximum display size while keeping the selected uppercase hierarchy.
2. Initial P2: the radar sat beside the heading instead of aligning with the marquee. Fixed by moving the real radar asset to the lower-right technical position used by the source.
3. Initial P0: the marquee referenced an animation name without defining its keyframes. Fixed with a seamless `translateX(-50%)` loop over two equal sequences.
4. Initial P1: closing the proof returned focus to the trigger and immediately reopened the focus preview. Fixed with a one-shot focus-preview suppression during programmatic focus restoration; browser evidence confirms the panel now stays closed.
5. Initial P1: leaving a temporarily hovered skill did not restore the pinned proof. Fixed by clearing only that skill's transient preview on pointer leave.
6. Initial P1: the duplicated visual controls could receive pointer focus inside an `aria-hidden` subtree. Fixed by preventing default focus on duplicate pointer presses while retaining click/tap behavior.
7. Initial P2: hovering marquee whitespace did not pause motion, and proof height could vary between records. Fixed with viewport-level hover pausing and stable responsive card heights with clamped variable text.
8. [P3] The radar sits closer to the right viewport edge than in the wider 1899 px concept because the live page uses the existing 72rem site container. This does not overlap controls or create horizontal overflow.
9. No remaining actionable P0, P1, or P2 issues.

## Implementation checklist

- [x] Replace only the About stack showcase with the compact marquee.
- [x] Keep all proven skills in CMS order and use the first ordered proof.
- [x] Add continuous motion, focus/selection pausing, reduced-motion fallback, and a hidden duplicate sequence.
- [x] Add hover/focus preview, click/tap pinning, keyboard navigation, Escape, and close behavior.
- [x] Render responsive CMS-backed proof evidence and missing-image fallback.
- [x] Preserve the landing-page stack and unrelated working-tree changes.
- [x] Verify TypeScript, targeted lint, desktop/tablet/mobile rendering, interaction state, and focused visual comparison without running a production build.

final result: passed

---

# Design QA - About education dossier without progress rail

## Artifacts

- Source visual truth: `C:\Users\Yumesh Ban\.codex\generated_images\019fc11e-826a-7fb2-ae35-8db15bc59ec7\exec-207c5b4b-2a11-4526-8e44-266f07e95ad6.png` (1640 x 946 px). The user explicitly rejected the source's left progress rail, so that rail is an intentional deviation.
- Browser-rendered implementation: `E:\Yumesh Ban\Projects\Yumesh-s-Portfolio\education-dossier-implementation.png` (1265 x 720 px).
- Route and state: `http://localhost:3000/about`, desktop education section with the current single BSc.CSIT record.
- Viewport: 1265 x 720 CSS px; implementation density is 1x. The source was assessed as an unframed concept board rather than pixel-matched because its rail was intentionally removed.
- Focused region: the BSc.CSIT identity block and three academic proof rows. A separate focused capture was unnecessary because all proof values are legible in the desktop section capture.

## Findings

- No actionable P0, P1, or P2 issues.
- [P3] The current CMS data contains one qualification, so the secondary academic row from the concept is not visible in this capture. The implementation maps every earlier Education record as a separate numbered horizontal row without a vertical rail.

## Fidelity review

- Fonts and typography: the existing display and mono hierarchy is retained; BSc.CSIT remains the most prominent education label and metric labels stay deliberately quiet.
- Spacing and layout rhythm: the primary record has a generous two-column desktop rhythm with a clear horizontal divider before any later record. Mobile has no horizontal overflow at 375 CSS px.
- Colors and visual tokens: the existing black surface, white typography, restrained blue index line, and thin white dividers match the About page palette.
- Image quality and asset fidelity: this section has no image asset; the user-directed removal of the source rail avoids replacing it with a decorative approximation.
- Copy and content: institution, dates, location, summary, achievement values, and later qualifications all remain CMS-driven.

## Comparison history

1. Source concept included a blue vertical education rail and dots. The user requested their removal.
2. Replaced the rail with a quiet `01` index, a small horizontal blue rule, and border-separated records.
3. Post-fix browser capture confirms the BSc.CSIT primary record, proof rows, and no desktop or mobile horizontal overflow. Browser console had no warnings or errors.

## Implementation checklist

- [x] Remove the vertical progress rail and all timeline dots.
- [x] Keep the BSc.CSIT qualification as the primary academic record.
- [x] Keep academic proof values visible as structured rows.
- [x] Render later qualifications as numbered horizontal records.
- [x] Preserve existing Sanity-driven data and responsive behavior.
- [x] Run TypeScript and targeted ESLint checks.

final result: passed

---

# Design QA - About principles manifesto

## Artifacts

- Source visual truth: `C:\Users\YUMESH~1\AppData\Local\Temp\codex-clipboard-c828c4cc-82db-4ba3-88ad-44e5b5181e62.png` (1648 x 954 px).
- Desktop resting implementation: `C:\Users\Yumesh Ban\.codex\visualizations\2026\08\02\019fc11e-826a-7fb2-ae35-8db15bc59ec7\about-manifesto-desktop.png` (1265 x 712 px).
- Desktop keyboard-reveal implementation: `C:\Users\Yumesh Ban\.codex\visualizations\2026\08\02\019fc11e-826a-7fb2-ae35-8db15bc59ec7\about-manifesto-focus-reveal.png` (1265 x 712 px).
- Mobile implementation: `C:\Users\Yumesh Ban\.codex\visualizations\2026\08\02\019fc11e-826a-7fb2-ae35-8db15bc59ec7\about-manifesto-mobile.png` (375 x 812 captured pixels from a 390 x 844 CSS viewport).
- Side-by-side comparison: `C:\Users\Yumesh Ban\.codex\visualizations\2026\08\02\019fc11e-826a-7fb2-ae35-8db15bc59ec7\about-manifesto-comparison.png` (2527 x 712 px).
- Desktop viewport: 1280 x 720 CSS px at the browser's normal density. The source was proportionally downscaled to the same 712 px captured height for comparison.
- States: desktop resting, desktop keyboard focus/reveal, and mobile touch-equivalent resting state.

## Evidence

- Full-view comparison confirms the staggered left/right manifesto composition, oversized uppercase typography, blue keyword emphasis, mono indices, dark surface, and restrained rules match the selected direction.
- Focused interaction evidence confirms the first principle is keyboard reachable and reveals the complete explanatory paragraph with `opacity: 1` and `visibility: visible`.
- The same CSS state is attached to `:hover` for fine pointers. The in-app browser did not expose a reliable synthetic `:hover` state, so keyboard focus was used for browser-rendered interaction evidence.
- Mobile inspection at 390 x 844 confirms all three descriptions are statically visible, the reveal cue is removed, and document width remains equal to client width with no horizontal overflow.
- Browser console inspection returned no errors or warnings.

## Fidelity review

- Fonts and typography: the existing Geist and mono type system is preserved. Display weight, tight tracking, uppercase treatment, wrapping, and blue keyword contrast closely follow the source.
- Spacing and layout rhythm: alternating alignment and wide negative space are preserved. The implementation intentionally keeps slightly more vertical room than the static mock so revealed paragraphs remain readable without layout shift.
- Colors and visual tokens: the existing near-black, white, muted-gray, and portfolio-blue tokens are reused without introducing a new palette.
- Image quality and asset fidelity: this section contains no raster imagery or custom icon assets; no placeholder or substituted asset is present.
- Copy and content: all three manifesto statements use the selected wording, while the revealed paragraphs reuse the existing About-page principles rather than adding new claims.

## Findings and comparison history

1. Initial P2: the first implementation measured 1328 px tall on desktop and felt noticeably looser than the reference. The item padding, detail reserve, and section spacing were tightened, reducing the section to approximately 1161 px while preserving readable reveal content.
2. Initial P2: fine-pointer reveal behavior would have hidden details in narrow desktop emulation. A max-width mobile override now guarantees descriptions remain visible below 768 px regardless of pointer capability.
3. Post-fix evidence: desktop maintains the selected editorial hierarchy and stable interaction area; mobile shows every description with no overflow.
4. No remaining actionable P0, P1, or P2 issues.

## Implementation checklist

- [x] Replace equal three-column principles with the selected staggered manifesto composition.
- [x] Reveal fuller reasoning on hover and keyboard focus without layout shift.
- [x] Keep details visible on touch and mobile layouts.
- [x] Preserve reduced-motion behavior.
- [x] Verify desktop and mobile overflow, keyboard interaction, console output, and targeted lint.

final result: passed

---

# Design QA — Origin-to-active stack path

**Comparison target**

- Source visual truth: `C:\Users\YUMESH~1\AppData\Local\Temp\codex-clipboard-16700125-0b1e-4d8b-9e4c-c747deaf1c75.png`.
- Requested change: draw the blue path from the Frontend origin through the active category and expose only the dial's right half.
- Implementation: `src/components/stack-scroll-experience.tsx` now animates separate sweep and endpoint-angle custom properties; `src/app/globals.css` renders the continuous arc and moves the dial left.

**Verification blocker**

- The in-app Browser timed out while creating a fresh local-page capture after the change. The Chrome fallback is unavailable in this environment. A browser-rendered implementation capture and active-category interaction check therefore could not be completed.

**Expected interaction**

- The blue arc starts at Frontend and sweeps clockwise to the active category.
- The endpoint dot follows the arc end.
- The static labels remain on the visible right-facing half of the dial.

final result: blocked

# Design QA — Static stack labels with rotating active path

**Comparison target**

- Source visual truth: `C:\Users\YUMESH~1\AppData\Local\Temp\codex-clipboard-bdb6b105-06a1-4afc-a6fe-812422b2e3d9.png`, the user-supplied homepage capture showing the previous single-label dial state.
- Requested visual change: show every stack on the dial's right-facing arc and move only the light-blue path and marker to the active stack.
- Browser-rendered implementation: in-app Browser capture of `http://127.0.0.1:3000/` at 1280 × 720 CSS px, Frontend active state. The capture was inspected in this task immediately after the change.
- State: desktop homepage, stack section aligned to the top of the viewport.

**Findings**

- No actionable P0, P1, or P2 issues found.
- The prior behavior rotated the entire dial wheel, which moved labels out of the visible arc. The wheel is now static; all stack buttons remain arranged from upper-right to lower-right.
- The blue arc and marker now live in a separate `stack-dial-indicator` layer. Its GSAP rotation uses the active category index, so the indicator travels circularly to the selected fixed label.

**Fidelity review**

- Fonts and typography: existing uppercase dial-label typography, weight, letter spacing, and active blue state remain intact.
- Spacing and layout rhythm: the dial exposes its right-facing half without overlapping the stack title; the left rail and proof column retain their existing rhythm.
- Colors and visual tokens: the existing navy, white, and light-blue palette is unchanged.
- Image quality and asset fidelity: no imagery or icon assets changed.
- Copy and content: category names and proof content are unchanged.

**Implementation checklist**

- [x] Keep category labels fixed on the visible arc.
- [x] Rotate only the active blue path and marker.
- [x] Preserve category buttons and their existing scroll behavior.
- [x] Keep the dial at the previously approved reduced scale.

**Residual test gap**

- The in-app browser became unresponsive after the captured visual state, so the post-change click transition could not be recaptured in the same session. The transition is isolated to the indicator transform; no label coordinates are animated.

final result: passed

---

# Design QA — Homepage stack dial reference rematch

## Artifacts

- Source visual truth: `stack-dial-reference.png` (1487 × 1058 px).
- Studio-content render: `stack-rematch-v3.png` (1473 × 1038 px).
- Current fallback-content render: `stack-rematch-final.png` (1473 × 1038 px).
- Full comparison: `stack-rematch-comparison.png`.
- Focused comparisons: `stack-rematch-comparison-left.png` and `stack-rematch-comparison-right.png`.
- Browser viewport: 1488 × 1058 CSS px. Browser chrome/scrollbar accounting produces a 1473 × 1038 captured viewport.

## Evidence

- At the captured section state, the stack root begins at y=96 and the first proof occupies x=719, y=96, width=652, height=864.
- The half dial occupies x=-535, y=129, width=768, height=768. Its active dot occupies x=98, y=218, width=18, height=18.
- The active stack title occupies x=305, y=368, width=352, height=60.
- The right proof media slot is 652 × 442 when Studio supplies an image. `stack-rematch-v3.png` verifies the real Merry Crochets image path; the fallback render intentionally exercises the text-and-tech fallback because the isolated QA server could not reach Sanity.
- The page has no horizontal document overflow at the reference viewport.
- Homepage uses the dial variant; `/about` continues to use the standard split-stack variant.
- Category and skill controls update the selected proof immediately, then scroll to its matching proof section.
- Reduced-motion users retain the readable layout without the GSAP entrance or pin animation.
- Targeted ESLint passed for the changed stack/header/homepage/content files.
- TypeScript passed with `tsc --noEmit`.
- A production build was intentionally not run; the user explicitly requested that builds not be repeated for visual iteration.

## Fidelity review

- Dial: replaced the earlier straight needle with the reference's curved blue arc, circular marker, concentric rings, dense tick track, and curved category labels.
- Layout: moved the left copy and skill list to the reference grid and matched the proof column's width, image ratio, proof pitch, and next-card entrance.
- Typography: matched the 60 px uppercase stack title, compact eyebrow/label treatment, two-line description, and 44 px proof title rhythm.
- Content: Studio remains the source of categories, skills, proof images, roles, descriptions, technology tags, ordering, and links. Missing media uses the required text fallback instead of a fake placeholder.
- Header: the wider reference-style header state is scoped to the homepage stack section, leaving the About-page header behavior unchanged.

## Findings and comparison history

1. P1: the first implementation used a straight clock hand and a fractional wedge layout. Fixed with a cropped circular dial, fixed active arc/dot, rings, tick track, and rotating authored category labels.
2. P1: the proof column was too low, too tall, and too narrow. Fixed to the measured 652 × 442 media slot and 864 px proof cadence.
3. P2: the left title, description, and skills were too far from the dial and used the wrong vertical rhythm. Fixed to the measured x≈305 rail and reference row spacing.
4. P2: category/skill clicks depended entirely on the scroll trigger before updating selection. Fixed by updating the selected proof immediately before scrolling.
5. Accepted dynamic-content difference: the isolated fallback render has no project screenshot because fallback project records do not contain media. The live Studio-content render demonstrates the real image state, and no image was hardcoded into the component.
6. No remaining actionable P0, P1, or P2 layout issues.

final result: passed

---

# Design QA — homepage stack dial

## Artifacts

- Source visual truth: `C:\Users\Yumesh Ban\.codex\generated_images\019fa7ba-e630-7172-81b4-a9cfd0df0e13\exec-8dffb797-eed8-4398-ad6e-479966443e3e.png` (1487 × 1058 px), selected ideation Option 1.
- Browser-rendered implementation: `stack-dial-implementation-final-v3.png` (1425 × 1004 px).
- Full side-by-side comparison: `stack-dial-design-comparison.png`.
- Focused left-side comparison: `stack-dial-design-comparison-left.png`.
- Focused proof comparison: `stack-dial-design-comparison-right.png`.
- Responsive evidence: `stack-dial-mobile.png` at 390 × 844 CSS px.
- Desktop viewport: 1440 × 1024 CSS px; the browser capture excludes its scrollbar area.
- State: homepage Current Stack section, Frontend category, Next.js proof.

## Evidence

- The homepage alone uses the half-dial variant; `/about` still renders the standard stack experience and its existing skill-map link.
- Category labels are generated from the authored stack categories rather than a fixed list, so newly added Studio categories enter the dial automatically.
- The dial enters from the left, rotates when the active category changes, and the corresponding proof panel moves upward as the page scrolls.
- Clicking the Backend dial label moved the first Backend proof to 96 px below the viewport top and updated the title to `BACKEND`.
- Clicking `Express.js` moved its proof to the same 96 px offset while preserving the Backend category state.
- Mobile collapses to a normal vertical category-and-proof sequence, hides the dial, and has no horizontal overflow.
- `prefers-reduced-motion` bypasses ScrollTrigger pinning and animated scrolling while leaving the static content readable.
- Browser console: no warnings or errors during the desktop and mobile verification pass.
- Targeted ESLint: passed.
- `npx.cmd tsc --noEmit --pretty false`: passed.
- `npm.cmd run build`: passed.

## Fidelity review

- Typography and alignment: the final pass reduced the dial title scale and aligned the category copy and skill list to the selected visual.
- Proof framing: the final pass removed the extra image padding so the live project interface fills the right-hand evidence frame like the reference.
- Visual system: the existing navy-black background, white typography, blue accent, borders, project media, technology logos, and CMS-authored copy are retained.
- Responsive layout: the dial is desktop-only; the smaller-screen version keeps the same content and click targets without depending on hover.

## Findings and fixes

1. P1: the initial title and skill list were too large and too far right. Fixed by narrowing the dial content rail, reducing the desktop title size, and shifting the content 2 rem left.
2. P1: the proof interface was inset inside its frame. Fixed by letting dial-variant images fill the evidence surface.
3. P1: native `scrollIntoView` stopped one proof early while the left rail was pinned. Fixed with a measured window scroll offset; category and skill navigation now land on the selected proof.
4. P2: the right proof began too low because desktop metadata consumed the top of the frame. Fixed by hiding that redundant row on desktop and using a 3:2 proof surface.
5. No remaining actionable P0, P1, or P2 issues.

## Implementation checklist

- [x] Preserve the About-page stack layout.
- [x] Derive dial categories and skill lists from Studio-authored content.
- [x] Animate dial entrance, category rotation, and upward proof reveal.
- [x] Make category and skill controls navigate to the exact proof.
- [x] Keep real project images, roles, descriptions, technology tags, and links.
- [x] Provide responsive and reduced-motion fallbacks.
- [x] Verify visual fidelity, behavior, console output, lint, TypeScript, and production build.

final result: passed

---

# Design QA — Experience graph scroll reveal

## Artifacts

- Source visual truth: `C:\Users\Yumesh Ban\.codex\generated_images\019fbdb6-0925-75e0-8550-9ed5e8672f3c\exec-8948067d-dff2-45d4-b700-67d76c465336.png` (1586 × 992 px), selected ideation Option 1.
- Browser-rendered implementation: `experience-scroll-motion-mid.png` (1265 × 712 px).
- Focused side-by-side comparison: `experience-scroll-motion-comparison.png` (1220 × 520 px).
- Browser viewport: 1280 × 720 CSS px at device pixel ratio 1. The screenshot excludes a small amount of browser-controlled scrollbar area.
- State: homepage Experience graph at approximately 3500 px scroll depth, with the first achievement complete and the next achievement drawing.

## Evidence

- Full-view evidence: the implementation screenshot shows the motion inside the existing graph column without shifting the experience content, navigation, graph geometry, or following section.
- Focused comparison: the combined image shows the selected concept and implementation together. Both use a faint upcoming spline, a brighter actively drawing segment, progressive spine reveal, node sequencing, and label reveal within the same dark-blue visual system.
- Scroll progression was measured at four positions. The first arc's normalized dash offset changed from `1` to `0.9478`, `0.0635`, and `0`; its endpoint, label, and dashed tail revealed afterward.
- A two-achievement row was measured separately: the first arc completed before the second progressed (`[0, 1]` then `[0, 0.3221]` then `[0, 0]`).
- Achievement labels retain `pointer-events: auto` and the existing `group-hover:opacity-100` tooltip behavior.
- The scroll effect is desktop-only and wrapped in `prefers-reduced-motion: no-preference`; unsupported browsers retain the fully visible static graph.
- Browser console: no errors.
- `npm.cmd run lint -- src/app/page.tsx`: passed.
- `npm.cmd run build`: passed.

## Fidelity review

- Fonts and typography: unchanged from the existing portfolio; label sizes, weights, wrapping, and tooltip copy remain intact.
- Spacing and layout rhythm: no graph positions, row heights, arc geometry, node positions, or content spacing were changed.
- Colors and visual tokens: existing blue stroke tokens are retained; the only new visual state is a 14% opacity upcoming-path track and a temporary localized blue drawing glow.
- Image quality and asset fidelity: the graph remains vector-rendered and crisp; no raster assets or replacement icons were introduced.
- Copy and content: all live experience and achievement content is unchanged.

## Findings

- No remaining actionable P0, P1, or P2 issues.

## Comparison history

1. Initial P2: upcoming arcs disappeared completely before drawing, while the selected concept kept future geometry faintly visible. Fixed by adding a 14% opacity spline track beneath each animated stroke.
2. Post-fix evidence: `experience-scroll-motion-comparison.png` shows continuous faint future paths with the active blue segment drawing above them.

## Implementation checklist

- [x] Draw each spine with scroll progress.
- [x] Draw achievement arcs sequentially.
- [x] Reveal origin and endpoint nodes in sequence.
- [x] Lift and fade labels after their endpoints appear.
- [x] Reveal dashed tails last.
- [x] Preserve hover tooltips and graph geometry.
- [x] Provide reduced-motion and unsupported-browser fallbacks.
- [x] Verify the rendered interaction, comparison evidence, console, lint, and production build.

final result: passed

---

# Design QA — Assistant achievement timing correction

## Artifacts

- Source visual truth: `C:\Users\YUMESH~1\AppData\Local\Temp\codex-clipboard-734685e2-20d3-4713-86da-55c03e8a8e72.png` (1423 × 623 px).
- Browser-rendered implementation: `experience-scroll-motion-corrected.png` (1265 × 712 px).
- Focused side-by-side comparison: `experience-scroll-motion-correction-comparison.png` (1320 × 470 px).
- Browser viewport: 1280 × 720 CSS px at device pixel ratio 1.
- State: Assistant Video Editor row visible with its graph top at 179.81 CSS px.

## Evidence

- Full-view evidence: the corrected implementation keeps the Assistant Video Editor content and both achievement branches visible together within the same viewport.
- Focused comparison: the combined crop shows the reported state on the left and the corrected state on the right. The corrected branches are continuous solid curves and both achievement endpoints and labels are present.
- At the corrected viewport state, both animated arcs report `stroke-dasharray: none` and `stroke-dashoffset: 0px`.
- Both achievement endpoints and labels report opacity `1` while the Assistant row remains visible.
- The second dashed continuation is intentionally still finishing at this moment; the curved achievement branch itself is already complete and solid.
- Browser console: no errors.
- `npm.cmd run lint -- src/app/page.tsx`: passed.
- `npm.cmd run build`: passed.

## Fidelity review

- Fonts and typography: unchanged; both achievement labels retain their existing size, weight, line height, truncation, and tooltip copy.
- Spacing and layout rhythm: unchanged; no graph geometry, row height, node position, or section spacing was modified.
- Colors and visual tokens: unchanged; the existing blue strokes and opacity levels are preserved.
- Image quality and asset fidelity: the code-native graph remains vector-rendered and crisp.
- Copy and content: unchanged.

## Findings

- No remaining actionable P0, P1, or P2 issues for the two reported problems.

## Comparison history

1. P2: completed curved branches retained their drawing dash pattern. Fixed by switching `stroke-dasharray` to `none` at the end of the draw animation.
2. P1: the second achievement completed after the Assistant Video Editor row had nearly left the viewport. Fixed by compressing both achievement sequences so the second endpoint and label finish by 50% of the row view timeline.
3. Post-fix evidence: at graph top 179.81 px, both arcs are solid and both achievement labels and endpoints are fully visible.

## Implementation checklist

- [x] Keep the curve animated while it is drawing.
- [x] Make the completed curve fully solid.
- [x] Reveal both Assistant achievements while its row is visible.
- [x] Preserve the dashed continuation beneath endpoints.
- [x] Preserve geometry, hover behavior, copy, and responsive constraints.
- [x] Verify visually, inspect computed states, check console, lint, and build.

final result: passed

---

# Design QA — Smaller homepage stack dial and stable navbar

## Artifacts

- Source visual truth: `stack-rematch-v3.png` (1473 × 1038 px), representing the previously accepted homepage stack state.
- User-directed change: reduce the dial by about 40% and remove the stack-specific navbar enlargement.
- Browser-rendered implementation: `stack-dial-smaller-navbar-fixed.png` (1473 × 1038 px).
- Full side-by-side comparison: `stack-dial-size-comparison.png` (2970 × 1038 px), before on the left and implementation on the right.
- Browser viewport: 1488 × 1058 CSS px; captured viewport is 1473 × 1038 px because of browser-controlled scrollbar/chrome accounting.
- State: homepage Frontend stack proof aligned at section top y=96.

## Evidence

- The dial changed from 768 × 768 CSS px to 461 × 461 CSS px, which is 60% of its former diameter.
- The resized dial remains attached off the left edge at x=-302 and introduces no horizontal document overflow.
- The stack title and right-side proof retain their existing positions and dimensions; only the dial geometry changed.
- The stack-only `isStackActive` navbar state and its 86.75rem enlargement were removed. The navbar now uses the same normal unscrolled/scrolled states across the homepage.
- Browser console: no errors or warnings.
- Targeted ESLint: passed.
- TypeScript with `tsc --noEmit`: passed.
- Production build: intentionally not run for this visual iteration.

## Fidelity review

- Fonts and typography: stack and proof typography are unchanged; dial labels remain readable at 0.66rem after resizing.
- Spacing and layout rhythm: left copy, skill rows, proof column, and proof cadence are unchanged. The smaller dial creates more breathing room at the left edge.
- Colors and visual tokens: existing navy, white, and blue tokens are unchanged.
- Image quality and asset fidelity: Studio-supplied Merry Crochets imagery remains sharp and unchanged.
- Copy and content: unchanged.

## Findings and comparison history

1. P2: the dial dominated too much horizontal and vertical space. Fixed by scaling its shell, rings, tick track, arc, marker, and label radius to 60%.
2. P1: entering the stack section activated a separate oversized navbar layout. Fixed by removing the stack-intersection header state and restoring the normal navbar behavior.
3. Post-fix comparison shows the dial materially smaller while the stack content and proof remain stable.
4. No remaining actionable P0, P1, or P2 issues.

final result: passed

---

# Design QA - Contact SVG pulse alignment (current)

- Blip traversal increased from 4 seconds to 7 seconds with randomized scheduling retained.
- The SVG endpoint is positioned from the measured Contact me link, targeting its top center.
- `tsc --noEmit --pretty false`: passed (exit 0); the homepage route returns HTTP 200.
- Visual capture is blocked because the local preview could not be reached by the available browser surfaces.

final result: blocked

---

# Design QA - About stack radar label removal

- Reference: `C:\Users\YUMESH~1\AppData\Local\Temp\codex-clipboard-d70e5ec3-a8e5-4062-938d-9802413130b0.png`.
- Browser capture: `stack-radar-lowered.png`.
- Focused comparison: `stack-radar-adjustment-comparison.png`.
- The `01 / 16` count and `ACTIVE PROOF` label are removed from the rendered markup and their unused styles are removed.
- The complete radar target is shifted 0.75rem below its former rail-centered position while preserving its internal logo alignment.
- The marquee, active-skill state, and proof disclosure behavior are unchanged.
- Browser console: no errors or warnings.
- Targeted ESLint: passed.
- TypeScript with `tsc --noEmit`: passed.
- Production build: intentionally not run, per request.
- No remaining actionable P0, P1, or P2 issues for this adjustment.

final result: passed

---

# Design QA - About stack honeycomb selector

- Approved reference: `C:\Users\Yumesh Ban\.codex\generated_images\019fc87f-83ca-7810-99bb-08582fa41f03\exec-6ecb2178-0987-4a38-b35b-bbd6d5429232.png`.
- Browser implementation capture: `stack-honeycomb-open.png` at 1440 x 1024.
- Side-by-side review: `stack-honeycomb-comparison.png`.
- The radar/count treatment is replaced by a right-aligned six-row honeycomb containing all 16 proven tools.
- Every technology with an available brand mark uses a local SVG asset; soft skills retain compact text monograms.
- Clicking a tile opens the existing proof disclosure, clicking another switches proof, and clicking the selected tile closes it.
- The marquee and honeycomb share the same active state and proof data.
- The honeycomb is desktop-only; 1024 px and 390 px retain the marquee selector with no horizontal overflow.
- Browser interaction checks passed for open, switch, and toggle-close states.
- The earlier `contains()` pointer-leave exception was fixed by validating `relatedTarget` before the containment check.
- The browser recorded one unrelated stale Turbopack cache error referencing `/projects`; no stack-component runtime errors remained.
- Targeted ESLint and `tsc --noEmit` previously passed before the final event-target guard; the combined rerun timed out after five minutes without diagnostics.
- Production build intentionally not run, per request.
- No remaining actionable P0, P1, or P2 issues for this implementation.

final result: passed

---

# Design QA - About stack serial rhythm and marquee pause timing

- Reference reviewed: `C:\Users\Yumesh Ban\.codex\generated_images\019fc87f-83ca-7810-99bb-08582fa41f03\exec-6ecb2178-0987-4a38-b35b-bbd6d5429232.png`.
- The stack title now uses the same 2.25–3rem visual scale as the preceding foundation section.
- The marquee icons, labels, line position, gap, and viewport width are reduced modestly to add breathing room.
- Honeycomb rows are generated as a serial alternating pattern: `3–2–3–2–3–2–1` for the current 16 proven tools. A partial final row remains centered on the same path.
- Hover continues to use CSS pause/resume behavior; leaving the marquee clears that hover pause immediately.
- Any marquee or honeycomb click pauses the marquee for five seconds, then resumes while the selected proof remains open.
- Browser verification at desktop: rows reported `[3, 2, 3, 2, 3, 2, 1]`; clicking Next.js set `data-paused` to `true`, and it returned to `false` after 5.2 seconds.
- No horizontal overflow was detected. Targeted ESLint for `compact-stack-marquee.tsx` passed.
- Production build intentionally not run, per request.

final result: passed
