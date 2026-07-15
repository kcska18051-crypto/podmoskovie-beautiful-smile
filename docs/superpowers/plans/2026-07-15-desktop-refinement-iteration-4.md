# Desktop Refinement Iteration 4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved second-wave desktop refinements while preserving the existing mobile composition and site-shell snapshots.

**Architecture:** Keep the current static HTML/CSS/JavaScript structure. Add desktop-only copy-break helpers, replace situation photography with six consistent flat-background assets, and extend the existing step-tab panels with one responsive image per panel. Structural tests guard the approved presentation rules before visual verification.

**Tech Stack:** Semantic HTML, CSS media queries, vanilla JavaScript, Node.js test runner, built-in image generation.

## Global Constraints

- Approved colors remain unchanged; situation backgrounds use `#F5F5F5` and the facts band uses solid `#1FBBC7`.
- Desktop-specific line breaks must not force awkward wrapping below 767 px.
- Mobile steps remain image-free and retain the current compact panel layout.
- Header, footer, doctors, and ratings remain locked.
- Generated people must look natural, with no text, watermark, or visibly synthetic styling.

---

### Task 1: Lock the iteration-four presentation contract

**Files:**
- Modify: `prototype/tests/structure.test.mjs`
- Test: `prototype/tests/structure.test.mjs`

**Interfaces:**
- Consumes: current `index.html`, `components.css`, and `content.mjs`.
- Produces: failing assertions for desktop copy breaks, solid facts band, uniform situation styling, slower path transitions, and four step images.

- [ ] **Step 1: Write failing structural tests**

Assert that `index.html` contains `.desktop-break`, that `components.css` defines the solid facts background and desktop-only step media, that the path transition duration is at least `450ms`, and that four `.steps-route__visual` images exist.

- [ ] **Step 2: Run the test and verify red**

Run: `node --test tests/structure.test.mjs`

Expected: the new iteration-four test fails because the contract is not implemented.

- [ ] **Step 3: Keep existing tests unchanged**

Do not weaken the 13 passing tests from iteration three.

### Task 2: Apply copy, color, alignment, and motion refinements

**Files:**
- Modify: `prototype/index.html`
- Modify: `prototype/assets/css/components.css`
- Modify: `prototype/assets/js/content.mjs`
- Test: `prototype/tests/structure.test.mjs`

**Interfaces:**
- Consumes: `.desktop-break`, `.hero-facts--accent`, `.situation-card`, `.care-cta__doctor`, and `.path-card`.
- Produces: deterministic desktop wrapping and approved styling without changing mobile copy behavior.

- [ ] **Step 1: Add controlled copy breaks**

Use `<br class="desktop-break">` for the approved hero, situations, and CTA breakpoints. Hide those breaks below 767 px.

- [ ] **Step 2: Flatten the facts and situation colors**

Set `.hero-facts--accent { background:#1FBBC7; }`, remove its decorative pseudo-element, set the situation card and photo area to `#F5F5F5`, and remove the photo-edge gradient.

- [ ] **Step 3: Enlarge and reposition the CTA doctor**

Increase the desktop doctor width and shift the image toward the copy while preserving headroom. Keep mobile overrides intact.

- [ ] **Step 4: Slow the path interaction**

Use a `480ms cubic-bezier(.22,.61,.36,1)` transition and reduce the hover lift so the change reads as calm rather than abrupt.

- [ ] **Step 5: Run the structural tests**

Run: `node --test tests/structure.test.mjs`

Expected: copy/color/motion assertions pass; image assertions remain red until Task 3.

### Task 3: Produce the unified situation imagery

**Files:**
- Create: `prototype/assets/images/situations/unified-01.png`
- Create: `prototype/assets/images/situations/unified-02.png`
- Create: `prototype/assets/images/situations/unified-03.png`
- Create: `prototype/assets/images/situations/unified-04.png`
- Create: `prototype/assets/images/situations/unified-05.png`
- Create: `prototype/assets/images/situations/unified-06.png`
- Modify: `prototype/assets/js/content.mjs`

**Interfaces:**
- Consumes: six situation meanings and the `#F5F5F5` visual standard.
- Produces: six 4:3 natural portraits with the person composed on the right and clean negative space on the left.

- [ ] **Step 1: Generate six distinct project-bound assets**

Create one image per situation using separate prompts. Each image uses a perfectly flat `#F5F5F5` background, waist/chest-up natural portrait, person touching or indicating the relevant area, no text, no shadowed studio backdrop, and generous left-side negative space.

- [ ] **Step 2: Inspect every generated image**

Reject any asset with dental anatomy errors, cropped heads/hands, visible gradients, artificial skin, or a subject not clearly placed at the right edge.

- [ ] **Step 3: Update the content data**

Point all six situation entries to `unified-01.png` through `unified-06.png`.

- [ ] **Step 4: Run the structural tests**

Run: `node --test tests/structure.test.mjs`

Expected: situation-image assertions pass.

### Task 4: Add four desktop step visuals

**Files:**
- Create: `prototype/assets/images/steps/consultation.png`
- Create: `prototype/assets/images/steps/diagnostics.png`
- Create: `prototype/assets/images/steps/plan.png`
- Create: `prototype/assets/images/steps/treatment.png`
- Modify: `prototype/index.html`
- Modify: `prototype/assets/css/components.css`
- Test: `prototype/tests/structure.test.mjs`

**Interfaces:**
- Consumes: existing `data-step-panel` tabs.
- Produces: `.steps-route__visual` inside each panel, visible above 767 px and hidden at or below 767 px.

- [ ] **Step 1: Generate four distinct clinical visuals**

Create natural horizontal dental-clinic images for consultation, diagnostics, collaborative planning, and treatment/follow-up. Use bright white interiors with restrained `#1FBBC7` accents, no text, no logos, and no invasive close-ups.

- [ ] **Step 2: Add an image to each step panel**

Place `<img class="steps-route__visual" ...>` as the first child of each article with descriptive Russian alt text.

- [ ] **Step 3: Rebuild only the desktop panel layout**

Use a two-column grid with the image on the left and copy on the right. Remove the desktop diagonal pseudo-element and large decorative number. At 767 px and below, hide `.steps-route__visual` and keep the existing mobile panel structure.

- [ ] **Step 4: Run all tests**

Run: `node --test tests/structure.test.mjs`

Expected: all tests pass.

### Task 5: Visual verification and publication

**Files:**
- Verify: `prototype/index.html`
- Publish to: `C:/Users/User/Desktop/Подмосковье/podmoskovie-beautiful-smile`

**Interfaces:**
- Consumes: complete iteration-four implementation.
- Produces: verified local and public GitHub Pages builds.

- [ ] **Step 1: Verify desktop at 1440 × 900**

Check the hero lines, solid facts band, all six situation cards, CTA doctor placement, path hover, and all four step tabs.

- [ ] **Step 2: Verify mobile at 390 × 844**

Check natural wrapping, situation-card cropping, current step layout, team carousel, and new footer asset.

- [ ] **Step 3: Check technical regressions**

Confirm no console errors, broken images, or horizontal overflow, and run `node --test tests/structure.test.mjs` one final time.

- [ ] **Step 4: Copy, commit, push, and verify Pages**

Copy only the changed project files, commit them, push `main`, wait for GitHub Pages status `built`, then verify the public URL.
