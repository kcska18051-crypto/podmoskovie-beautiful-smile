# Visual Seams Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Убрать заметные стыки в hero, блоке преимуществ и карточках ситуаций без изменения структуры страницы.

**Architecture:** Изменения ограничены CSS-компонентами. Существующая HTML-структура, изображения, интерактивность и мобильная компоновка сохраняются; новые правила проверяются структурным тестом и браузерным аудитом.

**Tech Stack:** HTML5, CSS3, Node.js `node:test`, статический GitHub Pages.

## Global Constraints

- Hero-свечение: 420×420 px, центральная непрозрачность 28%, только за группой людей.
- Фон преимуществ: `#F5F5F5`; карточки: `#1FBBC7`; текст карточек белый.
- Переход фотографии в текст: псевдоэлемент с градиентом от `#F5F5F5` к прозрачности.
- Мобильная компоновка и интерактивные состояния не меняются.

---

### Task 1: Контракт визуальных стыков

**Files:**
- Modify: `tests/structure.test.mjs`
- Test: `tests/structure.test.mjs`

**Interfaces:**
- Consumes: текст `assets/css/components.css`.
- Produces: регрессионный тест `implements the visual seams refinement contract`.

- [ ] **Step 1: Write the failing test**

```js
test('implements the visual seams refinement contract', async () => {
  const css = await read('../assets/css/components.css');
  assert.match(css, /\.hero__glow--one\s*\{[^}]*width:\s*420px[^}]*height:\s*420px/s);
  assert.match(css, /\.hero-facts--accent\s*\{[^}]*background:\s*#F5F5F5/s);
  assert.match(css, /\.hero-facts li\s*\{[^}]*background:\s*#1FBBC7/s);
  assert.match(css, /\.hero-facts strong[^}]*color:\s*var\(--white\)/s);
  assert.match(css, /\.situation-card__photo::before\s*\{[^}]*linear-gradient/s);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/structure.test.mjs`
Expected: FAIL in `implements the visual seams refinement contract` because the old colors, glow size, and missing photo overlay do not match.

### Task 2: Minimal CSS implementation

**Files:**
- Modify: `assets/css/components.css`
- Test: `tests/structure.test.mjs`

**Interfaces:**
- Consumes: existing `.hero__glow--one`, `.hero-facts*`, and `.situation-card__photo` selectors.
- Produces: revised desktop presentation without HTML or JavaScript changes.

- [ ] **Step 1: Implement the hero glow**

```css
.hero__glow { background:radial-gradient(circle,rgb(148 214 220 / 28%),rgb(228 247 250 / 3%) 66%,transparent 70%); }
.hero__glow--one { width:420px; height:420px; right:16%; bottom:-120px; }
```

- [ ] **Step 2: Implement the facts colors**

```css
.hero-facts--accent { background:#F5F5F5; }
.hero-facts li { background:#1FBBC7; box-shadow:0 14px 34px rgb(0 150 170 / 12%); }
.hero-facts li::before { background:var(--orange); }
.hero-facts strong { color:var(--white); }
.hero-facts span { color:rgb(255 255 255 / 88%); }
```

- [ ] **Step 3: Implement the situation image blend**

```css
.situation-card__photo::before {
  content:'';
  position:absolute;
  z-index:1;
  inset:0 auto 0 0;
  width:34%;
  background:linear-gradient(90deg,#F5F5F5 0%,rgb(245 245 245 / 82%) 32%,transparent 100%);
  pointer-events:none;
}
```

- [ ] **Step 4: Run structural tests**

Run: `node --test tests/structure.test.mjs tests/ui-state.test.mjs`
Expected: all 19 tests PASS.

### Task 3: Responsive verification and publication

**Files:**
- Modify: none.
- Test: public page in the in-app browser.

**Interfaces:**
- Consumes: published static assets.
- Produces: verified GitHub Pages deployment.

- [ ] **Step 1: Verify desktop at 1440×960**

Check: no horizontal overflow, no broken images, 420 px glow, neutral facts background, turquoise fact cards, visible image blend.

- [ ] **Step 2: Verify mobile at 390×844**

Check: no horizontal overflow, no broken images, interactive cards remain usable.

- [ ] **Step 3: Commit and publish**

```text
git add assets/css/components.css tests/structure.test.mjs docs/superpowers/plans/2026-07-15-visual-seams-refinement.md
git commit -m "Refine visual transitions between sections"
git push origin main
```

- [ ] **Step 4: Verify GitHub Pages build**

Run: `gh api repos/kcska18051-crypto/podmoskovie-beautiful-smile/pages/builds/latest`
Expected: `status` equals `built` and `commit` equals the new local `HEAD`.
