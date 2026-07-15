# Mobile Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Обновить мобильные фичеры, карточки ситуаций, CTA с врачом и карточки этапов, сохранив существующую интерактивность.

**Architecture:** Контент ситуаций получает версию URL для сброса кэша. Все визуальные изменения выполняются существующими компонентами и мобильными CSS-правилами; HTML и JavaScript переключения этапов не меняются.

**Tech Stack:** HTML5, CSS3, ES modules, Node.js `node:test`, GitHub Pages.

## Global Constraints

- Карточки фичеров: белый фон, окантовка `#1FBBC7`, левый акцент `#94D6DC`.
- Мобильные фичеры: одна карточка в строке.
- Мобильная ситуация: высота 188 px, изображение 44%, заголовок 19 px.
- URL ситуаций: суффикс `?v=mobile2`.
- Отступ между CTA-кнопкой и врачом: 36 px; область врача: 420 px.
- Мобильная фотография этапа: 180 px и голубая нижняя линия 4 px.
- Десктопные ситуации, CTA и этапы сохраняют существующую компоновку.

---

### Task 1: Регрессионный контракт мобильной версии

**Files:**
- Modify: `tests/structure.test.mjs`
- Test: `tests/structure.test.mjs`

**Interfaces:**
- Consumes: `assets/css/components.css`, `assets/js/content.mjs`.
- Produces: тест `implements the approved mobile refinement contract`.

- [ ] **Step 1: Write the failing test**

```js
test('implements the approved mobile refinement contract', async () => {
  const css = await read('../assets/css/components.css');
  const content = await read('../assets/js/content.mjs');
  assert.match(css, /\.hero-facts li\s*\{[^}]*background:\s*var\(--white\)/s);
  assert.match(css, /\.hero-facts li::before\s*\{[^}]*background:\s*#94D6DC/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.hero-facts ul\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.situation-card\s*\{[^}]*min-height:\s*188px/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.care-cta__doctor\s*\{[^}]*min-height:\s*420px/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.steps-route__visual\s*\{[^}]*display:\s*block[^}]*height:\s*180px/s);
  for (let index = 1; index <= 6; index += 1) {
    assert.match(content, new RegExp(`situations/unified-0${index}\\.png\\?v=mobile2`));
  }
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test tests/structure.test.mjs`
Expected: FAIL because the current mobile layout hides step images, uses three-column facts styling, and has unversioned situation URLs.

### Task 2: Фичеры и актуальные ситуации

**Files:**
- Modify: `assets/css/components.css`
- Modify: `assets/js/content.mjs`
- Test: `tests/structure.test.mjs`

**Interfaces:**
- Consumes: existing `.hero-facts*` and `.situation-card*` selectors and the `situations` array.
- Produces: unified desktop/mobile colors and updated mobile situation composition.

- [ ] **Step 1: Change feature colors**

```css
.hero-facts li { border:1px solid #1FBBC7; background:var(--white); }
.hero-facts li::before { background:#94D6DC; }
.hero-facts strong { color:var(--turquoise-dark); }
.hero-facts span { color:var(--text-strong); }
```

- [ ] **Step 2: Add mobile feature and situation rules**

```css
@media (max-width:767px) {
  .hero-facts ul { grid-template-columns:1fr; gap:10px; }
  .hero-facts li { min-height:82px; grid-template-columns:auto 1fr; gap:14px; padding:16px 18px 16px 22px; text-align:left; }
  .situation-card { min-height:188px; }
  .situation-card__front { grid-template-columns:minmax(0,56%) 44%; }
  .situation-card__title { padding:22px 12px 22px 20px; font-size:19px; line-height:1.12; }
  .situation-card__photo,.situation-card__photo img { min-height:184px; height:184px; }
}
```

- [ ] **Step 3: Version the six image URLs**

Change every `assets/images/situations/unified-0N.png` to `assets/images/situations/unified-0N.png?v=mobile2` in `assets/js/content.mjs`.

- [ ] **Step 4: Run structural tests**

Run: `node --test tests/structure.test.mjs`
Expected: the new mobile contract still fails only on CTA and step visuals.

### Task 3: CTA doctor and mobile step visuals

**Files:**
- Modify: `assets/css/components.css`
- Test: `tests/structure.test.mjs`

**Interfaces:**
- Consumes: existing `.care-cta*` and `.steps-route*` HTML structure.
- Produces: non-overlapping doctor and active step image on mobile.

- [ ] **Step 1: Separate the doctor from the button**

```css
@media (max-width:767px) {
  .care-cta__copy { padding:52px 0 0; }
  .care-cta__doctor { min-height:420px; margin-top:36px; }
  .care-cta__doctor img { bottom:-24px; width:315px; height:390px; }
}
```

- [ ] **Step 2: Show each active step image above its copy**

```css
@media (max-width:767px) {
  .steps-route__panels { min-height:560px; }
  .steps-route__panels article { min-height:560px; padding:226px 24px 28px; background:var(--surface); }
  .steps-route__visual { display:block; inset:0 0 auto; width:100%; height:180px; border:0; border-bottom:4px solid #94D6DC; object-fit:cover; }
  .steps-route__panels article::before { top:199px; color:rgb(0 150 170 / 22%); }
  .steps-route__panels article .eyebrow { top:199px; color:var(--turquoise-dark); }
}
```

- [ ] **Step 3: Run the full suite**

Run: `node --test tests/structure.test.mjs tests/ui-state.test.mjs`
Expected: all 20 tests PASS.

### Task 4: Browser verification and publication

**Files:**
- Modify: none.
- Test: local and public page.

**Interfaces:**
- Consumes: final static files.
- Produces: verified GitHub Pages deployment.

- [ ] **Step 1: Verify at 390×844 and 375×812**

Check: zero horizontal overflow, zero broken images, one fact per row, six versioned situation images, CTA button does not intersect the doctor, active step image is visible.

- [ ] **Step 2: Verify desktop at 1440×960**

Check: zero overflow and unchanged situation, CTA, and steps composition.

- [ ] **Step 3: Commit and publish**

```text
git add assets/css/components.css assets/js/content.mjs tests/structure.test.mjs docs/superpowers/plans/2026-07-15-mobile-refinement.md
git commit -m "Refine mobile landing page presentation"
git push origin main
```

- [ ] **Step 4: Verify Pages build**

Run: `gh api repos/kcska18051-crypto/podmoskovie-beautiful-smile/pages/builds/latest`
Expected: `status` is `built` and `commit` matches local `HEAD`.
