# Footer and Style Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the screenshot footer with an accessible responsive HTML footer and align selected landing-page visuals with the approved “Отбеливание” design system without changing the funnel or interactions.

**Architecture:** Keep the existing static HTML/CSS/ES-module structure. Add the footer as semantic markup in `index.html`, keep its presentation in a dedicated `footer.css`, and limit page unification to existing component selectors in `components.css`. Existing `app.mjs` behavior remains the single interaction layer; the footer feedback button reuses `data-open-consultation`.

**Tech Stack:** Semantic HTML5, CSS custom properties and media queries, vanilla JavaScript ES modules, Node.js built-in test runner, GitHub Pages.

## Global Constraints

- Preserve the approved section order, copy, characters, doctors, CTA flow, FAQ behavior, case sliders, consultation forms, and step switcher.
- Keep the header unchanged.
- Keep `#doctors` and `#ratings` structure unchanged except for spacing fixes discovered during verification.
- Use `#FEFEFE`, `#F7F7F7`, `#F5F5F5`, `#E4F7FA`, existing turquoise tokens, and orange only for CTA or critical emphasis.
- Use gradients only in large expert or CTA banners.
- Desktop verification widths: 1280 and 1440 pixels.
- Mobile/tablet verification widths: 375, 390, and 768 pixels.
- Do not use one PNG or SVG image for the entire footer.
- Preserve keyboard access, visible focus, and no horizontal overflow.

## File Map

- Modify `index.html`: replace the footer `<picture>` with semantic footer columns and links.
- Modify `assets/css/base.css`: remove obsolete footer-snapshot rules and import/coordinate real footer styles.
- Create `assets/css/footer.css`: own all desktop, tablet, and mobile footer layout and states.
- Modify `assets/css/components.css`: restyle clinic facts, path cards, case note, expert proof cards, and step panel.
- Create `assets/images/footer/youtube.svg`, `zen.svg`, `vk.svg`, `rutube.svg`, `telegram.svg`, and `max.svg`: individual social icons based on the supplied footer/live site.
- Modify `tests/structure.test.mjs`: replace snapshot assertions and add the approved visual contracts.
- Keep `assets/js/app.mjs` unchanged unless verification proves the existing consultation trigger cannot serve the footer button.

---

### Task 1: Lock the New Footer and Visual Contracts in Tests

**Files:**
- Modify: `tests/structure.test.mjs`

**Interfaces:**
- Consumes: current `index.html`, `assets/css/base.css`, `assets/css/components.css`.
- Produces: static contracts for `.site-footer__grid`, `.site-footer__socials`, `.site-footer__legal`, `.hero-facts`, `.path-card`, `.expert__proofs`, and `.steps-route__panels`.

- [ ] **Step 1: Replace the obsolete screenshot-footer test with a failing semantic-footer test**

```js
test('uses a semantic responsive footer instead of a page-wide snapshot', async () => {
  const html = await read('../index.html');
  const footerCss = await read('../assets/css/footer.css');

  assert.match(html, /<footer[^>]+class="site-footer/);
  assert.match(html, /class="site-footer__grid"/);
  assert.match(html, /class="site-footer__contacts"/);
  assert.match(html, /class="site-footer__socials"/);
  assert.match(html, /class="site-footer__legal"/);
  assert.match(html, /href="tel:\+74852744545"/);
  assert.match(html, /href="mailto:mail@mc-podmoskovie\.ru"/);
  assert.doesNotMatch(html, /footer-desktop-viewport\.png|footer-mobile\.svg/);
  assert.doesNotMatch(html, /site-shell-picture--footer/);
  assert.match(footerCss, /\.site-footer__grid\s*\{[^}]*grid-template-columns:/s);
  assert.match(footerCss, /@media \(max-width:\s*767px\)[\s\S]*?\.site-footer__grid\s*\{[^}]*grid-template-columns:\s*1fr/s);
});
```

- [ ] **Step 2: Add a failing unification contract**

```js
test('matches the approved whitening-page visual language', async () => {
  const css = await read('../assets/css/components.css');

  assert.match(css, /\.hero-facts li\s*\{[^}]*border:\s*1px solid #1FBBC7[^}]*background:\s*var\(--white\)/s);
  assert.doesNotMatch(css, /\.hero-facts li::before/);
  assert.doesNotMatch(css, /\.hero-facts li\s*\{[^}]*box-shadow:/s);
  assert.match(css, /\.path-card\s*\{[^}]*border:\s*1px solid/s);
  assert.doesNotMatch(css, /\.paths::before/);
  assert.match(css, /\.expert__proofs li:is\(:hover,:focus-within\)\s*\{[^}]*background:\s*var\(--blue-050\)/s);
  assert.match(css, /\.steps-route__panels article\s*\{[^}]*border:\s*1px solid[^}]*background:\s*var\(--surface\)/s);
  assert.doesNotMatch(css, /\.steps-route__panels article\s*\{[^}]*border-top:\s*4px solid/s);
});
```

- [ ] **Step 3: Run the focused structure test and confirm red state**

Run: `node --test tests/structure.test.mjs`

Expected: FAIL because `footer.css` and semantic footer markup do not exist and legacy visual rules remain.

- [ ] **Step 4: Commit the failing contracts**

```bash
git add tests/structure.test.mjs
git commit -m "test: define footer and style unification contracts"
```

---

### Task 2: Build the Responsive Semantic Footer

**Files:**
- Modify: `index.html`
- Modify: `assets/css/base.css`
- Create: `assets/css/footer.css`
- Create: `assets/images/footer/youtube.svg`
- Create: `assets/images/footer/zen.svg`
- Create: `assets/images/footer/vk.svg`
- Create: `assets/images/footer/rutube.svg`
- Create: `assets/images/footer/telegram.svg`
- Create: `assets/images/footer/max.svg`
- Test: `tests/structure.test.mjs`

**Interfaces:**
- Consumes: existing `.container`, `.button`, palette tokens, and `[data-open-consultation]` handler.
- Produces: `.site-footer`, `.site-footer__grid`, `.site-footer__contacts`, `.site-footer__nav`, `.site-footer__services`, `.site-footer__socials`, and `.site-footer__legal`.

- [ ] **Step 1: Add the dedicated footer stylesheet after component styles**

```html
<link rel="stylesheet" href="assets/css/components.css">
<link rel="stylesheet" href="assets/css/footer.css">
<link rel="stylesheet" href="assets/css/responsive.css">
```

- [ ] **Step 2: Replace the `<picture>` footer with semantic columns**

```html
<footer class="site-footer" data-locked="true" aria-label="Подвал сайта">
  <div class="container site-footer__grid">
    <section class="site-footer__contacts" aria-label="Контакты клиники">
      <a class="site-footer__phone" href="tel:+74852744545">+7 (4852) 74-45-45</a>
      <a href="mailto:mail@mc-podmoskovie.ru">mail@mc-podmoskovie.ru</a>
      <p>Подмосковье в соцсетях</p>
      <div class="site-footer__socials">
        <a href="https://www.youtube.com/channel/UCQbDby5BB8a7L2uYpUuNo3A/videos" aria-label="YouTube"><img src="assets/images/footer/youtube.svg" alt=""></a>
        <a href="https://zen.yandex.ru/id/5ed5080263547c6b62d79d65" aria-label="Дзен"><img src="assets/images/footer/zen.svg" alt=""></a>
        <a href="https://vk.com/mc_podmoskovie" aria-label="ВКонтакте"><img src="assets/images/footer/vk.svg" alt=""></a>
        <a href="https://rutube.ru/channel/47150498/" aria-label="Rutube"><img src="assets/images/footer/rutube.svg" alt=""></a>
        <a href="https://t.me/mcpodmoskovie_bot?start=14974566517" aria-label="Telegram"><img src="assets/images/footer/telegram.svg" alt=""></a>
        <a href="https://max.ru/u/f9LHodD0cOKWs2_SFO6ywnXv-ccw5N1sqSATNJx3VPJP7K-DedwyqJKg804" aria-label="MAX"><img src="assets/images/footer/max.svg" alt=""></a>
      </div>
      <a href="https://www.mc-podmoskovie.ru/policy/">Политика конфиденциальности</a>
      <address>150040, Россия, Ярославская обл., город Ярославль г.о., Ярославль г., Некрасова ул., зд. 41, стр. 5, офис 47</address>
      <p>Пн.—Пт. 8.00—20.30;<br>Сб.—Вс. 9.00—17.00</p>
      <p>Рады получить обратную связь:</p>
      <a class="button site-footer__action" href="https://www.mc-podmoskovie.ru/otzyvy/">Благодарность</a>
      <button class="button site-footer__action" type="button" data-open-consultation>Обратная связь</button>
      <p class="site-footer__copyright">© ООО «МЦ «Подмосковье», 1998–2026</p>
      <p>Сайт создан в Волге-Веб</p>
    </section>
    <nav class="site-footer__nav" aria-label="Навигация в подвале">
      <a href="https://www.mc-podmoskovie.ru/about/"><strong>О клинике</strong></a>
      <a href="https://www.mc-podmoskovie.ru/doctors/"><strong>Врачи</strong></a>
      <div class="site-footer__group"><a href="https://www.mc-podmoskovie.ru/otzyvy/"><strong>Отзывы</strong></a><a href="https://www.mc-podmoskovie.ru/otzyvy/">Отзывы о врачах</a><a href="https://www.mc-podmoskovie.ru/otzyvy/">Отзывы о клинике</a><a href="https://www.mc-podmoskovie.ru/otzyvy/">Наши пациенты</a><a href="https://www.mc-podmoskovie.ru/otzyvy/cases/">Примеры работ</a><a href="https://www.mc-podmoskovie.ru/otzyvy/">Отзывы от партнёров</a></div>
      <a href="https://www.mc-podmoskovie.ru/policy/"><strong>Правовая информация</strong></a>
      <a href="https://www.mc-podmoskovie.ru/contacts/"><strong>Контакты</strong></a>
    </nav>
    <nav class="site-footer__services" aria-label="Услуги: лечение и диагностика">
      <div class="site-footer__group"><a href="https://www.mc-podmoskovie.ru/services/diagnostics/"><strong>Диагностика</strong></a><a href="https://www.mc-podmoskovie.ru/services/diagnostics/3d/">Трёхмерная (3D) томография</a><a href="https://www.mc-podmoskovie.ru/services/diagnostics/ortopantomogramma/">Ортопантомограмма</a><a href="https://www.mc-podmoskovie.ru/services/diagnostics/">Прицельные рентген-снимки</a><a href="https://www.mc-podmoskovie.ru/services/diagnostics/telerentgenogramma/">Телерентгенограмма</a></div>
      <div class="site-footer__group"><a href="https://www.mc-podmoskovie.ru/services/therapeutic/"><strong>Лечение зубов</strong></a><a href="https://www.mc-podmoskovie.ru/services/therapeutic/profilakticheskie-osmotry/">Профилактические осмотры</a><a href="https://www.mc-podmoskovie.ru/services/therapeutic/caries/">Лечение кариеса</a><a href="https://www.mc-podmoskovie.ru/services/therapeutic/pulpitis/">Лечение пульпита и периодонтита</a><a href="https://www.mc-podmoskovie.ru/services/therapeutic/restoration-of-teeth/">Художественная реставрация зубов</a><a href="https://www.mc-podmoskovie.ru/services/therapeutic/spasenie-travmirovannykh-zubov/">Спасение травмированных зубов</a><a href="https://www.mc-podmoskovie.ru/services/therapeutic/lechenie-zubov-pri-grudnom-vskarmlivanii-i-beremennosti/">Лечение при грудном вскармливании и беременности</a></div>
      <div class="site-footer__group"><a href="https://www.mc-podmoskovie.ru/services/"><strong>Челюстно-лицевая хирургия</strong></a><a href="https://www.mc-podmoskovie.ru/services/">Удаление зубов</a><a href="https://www.mc-podmoskovie.ru/services/">Пластика полости рта</a><a href="https://www.mc-podmoskovie.ru/services/">Зубосохраняющие операции</a></div>
      <a href="https://www.mc-podmoskovie.ru/services/"><strong>Детская стоматология</strong></a>
    </nav>
    <nav class="site-footer__services" aria-label="Услуги: восстановление и эстетика">
      <div class="site-footer__group"><a href="https://www.mc-podmoskovie.ru/services/"><strong>Имплантация зубов</strong></a><a href="https://www.mc-podmoskovie.ru/services/">Импланты Нобель</a><a href="https://www.mc-podmoskovie.ru/services/">Импланты Неодент</a><a href="https://www.mc-podmoskovie.ru/services/">All-on-4</a><a href="https://www.mc-podmoskovie.ru/services/">Костная пластика</a></div>
      <div class="site-footer__group"><a href="https://www.mc-podmoskovie.ru/services/"><strong>Протезирование</strong></a><a href="https://www.mc-podmoskovie.ru/services/">Коронки</a><a href="https://www.mc-podmoskovie.ru/services/">Виниры</a><a href="https://www.mc-podmoskovie.ru/services/">Съёмные протезы</a><a href="https://www.mc-podmoskovie.ru/services/">Спортивные каппы</a></div>
      <div class="site-footer__group"><a href="https://www.mc-podmoskovie.ru/services/ortodont/"><strong>Ортодонтия</strong></a><a href="https://www.mc-podmoskovie.ru/services/ortodont/">Брекет-системы</a><a href="https://www.mc-podmoskovie.ru/services/ortodont/">Раннее лечение прикуса</a></div>
      <a href="https://www.mc-podmoskovie.ru/services/"><strong>Гигиена и профилактика</strong></a><a href="https://www.mc-podmoskovie.ru/services/"><strong>Лечение дёсен</strong></a><a href="https://www.mc-podmoskovie.ru/services/krasivaya-ulybka/"><strong>Красивая улыбка</strong></a><a href="https://www.mc-podmoskovie.ru/services/whitening/"><strong>Отбеливание</strong></a><a href="https://www.mc-podmoskovie.ru/services/"><strong>Наркоз/Седация</strong></a>
    </nav>
  </div>
  <p class="site-footer__legal">ИМЕЮТСЯ ПРОТИВОПОКАЗАНИЯ, НЕОБХОДИМО ПРОКОНСУЛЬТИРОВАТЬСЯ СО СПЕЦИАЛИСТОМ</p>
</footer>
```

- [ ] **Step 3: Add isolated footer presentation**

```css
.site-footer{padding:72px 0 0;background:#F7F7F7;color:var(--text)}
.site-footer__grid{display:grid;grid-template-columns:1.05fr .75fr 1.1fr 1.1fr;gap:48px}
.site-footer a{color:var(--turquoise-dark);text-decoration:none}
.site-footer a:hover{text-decoration:underline}
.site-footer__contacts{display:grid;justify-items:start;gap:18px}
.site-footer__phone{color:var(--text-strong)!important;font-size:22px}
.site-footer address{max-width:280px;font-style:normal;line-height:1.65}
.site-footer__socials{display:flex;flex-wrap:wrap;gap:10px}
.site-footer__socials a{display:grid;width:38px;height:38px;place-items:center;border-radius:8px}
.site-footer__socials img{display:block;width:100%;height:100%;object-fit:contain}
.site-footer__action{min-width:190px}
.site-footer__nav,.site-footer__services{display:grid;align-content:start;gap:15px}
.site-footer__group{display:grid;gap:10px;margin-bottom:14px}
.site-footer__group strong{color:var(--turquoise-dark);font-size:16px}
.site-footer__group a{font-size:14px;line-height:1.45}
.site-footer__legal{margin:54px 0 0;padding:22px 24px;background:#FEFEFE;color:var(--text-strong);font-size:24px;font-weight:700;text-align:center}
@media (max-width:1100px){.site-footer__grid{grid-template-columns:1fr 1fr}.site-footer__contacts{grid-row:span 2}}
@media (max-width:767px){.site-footer{padding-top:48px}.site-footer__grid{grid-template-columns:1fr;gap:38px}.site-footer__contacts{grid-row:auto}.site-footer__action{width:100%}.site-footer__legal{font-size:16px;line-height:1.45}}
```

- [ ] **Step 4: Remove obsolete whole-footer image rules**

Delete `.site-shell-picture--footer img` rules from `assets/css/base.css`. Keep `.site-shell-picture--header` untouched.

- [ ] **Step 5: Run structure tests**

Run: `node --test tests/structure.test.mjs`

Expected: semantic footer test PASS; style-unification test still FAIL.

- [ ] **Step 6: Commit the footer**

```bash
git add index.html assets/css/base.css assets/css/footer.css assets/images/footer tests/structure.test.mjs
git commit -m "feat: replace footer snapshot with responsive markup"
```

---

### Task 3: Restyle the Clinic Facts to the Approved Reference

**Files:**
- Modify: `assets/css/components.css`
- Test: `tests/structure.test.mjs`

**Interfaces:**
- Consumes: existing `.hero-facts` markup and tokens.
- Produces: three equal outlined cards on desktop and one card per row below 768 pixels.

- [ ] **Step 1: Remove the decorative strip and shadow from facts**

```css
.hero-facts{padding:54px 0;border-bottom:0;background:#F5F5F5}
.hero-facts--accent{position:relative;overflow:hidden;background:#F5F5F5}
.hero-facts ul{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin:0;padding:0;list-style:none}
.hero-facts li{display:grid;align-content:start;min-height:176px;padding:30px;border:1px solid #1FBBC7;border-radius:16px;background:var(--white)}
.hero-facts strong{color:var(--turquoise);font-family:var(--font-heading);font-size:31px;line-height:1.1}
.hero-facts span{margin-top:18px;color:var(--text);font-size:15px;font-weight:500;line-height:1.5}
@media (max-width:767px){.hero-facts{padding:36px 0}.hero-facts ul{grid-template-columns:1fr;gap:16px}.hero-facts li{min-height:142px;padding:24px}.hero-facts strong{font-size:27px}.hero-facts span{margin-top:14px;font-size:14px}}
```

Remove the `.hero-facts li::before` block entirely.

- [ ] **Step 2: Run the structure tests**

Run: `node --test tests/structure.test.mjs`

Expected: facts assertions PASS; remaining unification assertions may still FAIL.

- [ ] **Step 3: Commit the facts refinement**

```bash
git add assets/css/components.css tests/structure.test.mjs
git commit -m "style: align clinic facts with whitening cards"
```

---

### Task 4: Unify Paths, Cases, Expert Proofs, and Steps

**Files:**
- Modify: `assets/css/components.css`
- Test: `tests/structure.test.mjs`

**Interfaces:**
- Consumes: existing HTML and all existing JS selectors/ARIA attributes.
- Produces: visually unified cards without changing interactive behavior.

- [ ] **Step 1: Simplify the paths section without changing hover behavior**

```css
.paths{position:relative;overflow:hidden;background:var(--surface-soft)}
.paths__grid{position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.path-card{border:1px solid #1FBBC7;border-radius:16px;background:var(--white);box-shadow:none;transition:background 480ms var(--ease),border-color 480ms var(--ease),transform 480ms var(--ease)}
.path-card:is(:hover,:focus-within){border-color:var(--turquoise-dark);background:var(--blue-050);transform:translateY(-4px)}
.paths__cta{border:1px solid #1FBBC7;border-radius:16px;background:var(--white);box-shadow:none;backdrop-filter:none}
```

Delete `.paths::before`.

- [ ] **Step 2: Keep the case layout and reduce decorative weight**

```css
.case-card{border:1px solid #1FBBC7;border-radius:16px;background:var(--white);box-shadow:none}
.cases__note{border:1px solid #1FBBC7;border-radius:16px;background:var(--surface-soft)}
.cases__note strong{background:var(--orange);color:var(--white)}
```

Keep the existing equal-height body, heading, and link alignment declarations.

- [ ] **Step 3: Make expert proof hover states lighter**

```css
.expert__proofs li{border:1px solid rgb(31 187 199 / 45%);background:var(--white);box-shadow:none;transition:transform 240ms var(--ease),background 240ms var(--ease),border-color 240ms var(--ease)}
.expert__proofs li:is(:hover,:focus-within){border-color:#1FBBC7;background:var(--blue-050);box-shadow:none;transform:translateY(-3px)}
.expert__proofs li:is(:hover,:focus-within) strong{color:var(--text-strong)}
.expert__proofs li:is(:hover,:focus-within) span{background:var(--turquoise-dark);transform:scale(1.04)}
```

- [ ] **Step 4: Remove the heavy top accent and shadow from the desktop step panel**

```css
.steps-route__panels article{position:absolute;isolation:isolate;inset:0;display:grid;align-content:center;min-height:330px;padding:42px 48px 42px 44%;overflow:hidden;border:1px solid #1FBBC7;border-radius:16px;background:var(--surface);box-shadow:none}
.steps-route__visual{position:absolute;inset:0 auto 0 0;width:39%;height:100%;object-fit:cover;object-position:center;border-right:1px solid #1FBBC7}
```

Keep the tab line, active number, hidden panels, keyboard behavior, mobile image height, and final-step CTA.

- [ ] **Step 5: Run the full automated suite**

Run: `node --test tests/structure.test.mjs tests/ui-state.test.mjs`

Expected: all tests PASS.

- [ ] **Step 6: Commit the component unification**

```bash
git add assets/css/components.css tests/structure.test.mjs
git commit -m "style: unify landing components with whitening page"
```

---

### Task 5: Responsive Visual Verification and Publication

**Files:**
- Modify: `assets/css/footer.css`
- Modify: `assets/css/components.css`
- Modify: `tests/structure.test.mjs`

**Interfaces:**
- Consumes: completed HTML/CSS/JS implementation.
- Produces: verified desktop/mobile page and published GitHub Pages build.

- [ ] **Step 1: Start the local static server**

Run: `node server.mjs`

Expected: local page available at `http://127.0.0.1:4173/` with no startup errors.

- [ ] **Step 2: Verify desktop widths 1440 and 1280**

Check:

```text
- facts: three equal white outlined cards
- no orange strip or card shadow
- footer: four readable columns at 1440, no collision at 1280
- paths: equal cards and stable hover geometry
- expert proofs: light-blue hover without white-on-turquoise text inversion
- steps: clean white outlined panel, no thick orange top edge
- no horizontal overflow
```

- [ ] **Step 3: Verify widths 768, 390, and 375**

Check:

```text
- facts: one card per row on 390/375
- footer: one ordered flow, contacts before navigation and services
- all footer links remain tappable and focusable
- footer warning wraps without clipping
- step image remains above content and exactly one panel is visible
- existing mobile situation cards and care CTA remain unchanged
- no horizontal overflow
```

- [ ] **Step 4: Verify interaction and console state**

Check one situation card, one path hover, all four step tabs, one FAQ item, one case slider, and the footer “Обратная связь” button. Confirm the consultation dialog opens and browser console has no errors.

- [ ] **Step 5: Run final tests immediately before publication**

Run: `node --test tests/structure.test.mjs tests/ui-state.test.mjs`

Expected: all tests PASS.

- [ ] **Step 6: Commit any verification-only fixes**

```bash
git add assets/css/footer.css assets/css/components.css tests/structure.test.mjs
git commit -m "fix: polish responsive footer and unified components"
```

Skip this commit if verification required no changes.

- [ ] **Step 7: Push and verify GitHub Pages**

Run: `git push origin main`

Expected: push succeeds and the latest GitHub Pages build completes successfully. Open the cache-busted public URL and repeat one desktop and one mobile smoke check.
