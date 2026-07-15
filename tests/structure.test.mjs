import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = relative => readFile(new URL(relative, import.meta.url), 'utf8');

test('contains every approved page section in funnel order', async () => {
  const html = await read('../index.html');
  const requiredIds = [
    'hero', 'situations', 'care-cta', 'paths', 'cases', 'team',
    'steps', 'faq', 'consultation', 'doctors', 'ratings'
  ];
  let cursor = -1;
  for (const id of requiredIds) {
    const next = html.indexOf(`id="${id}"`);
    assert.ok(next > cursor, `${id} is missing or out of order`);
    cursor = next;
  }
});

test('keeps site shell locked', async () => {
  const html = await read('../index.html');
  assert.match(html, /<header[^>]+data-locked="true"/);
  assert.match(html, /<footer[^>]+data-locked="true"/);
});

test('uses the approved palette and typography', async () => {
  const tokens = await read('../assets/css/tokens.css');
  for (const hex of [
    '#F08C07', '#E4F7FA', '#94D6DC', '#1FBBC7', '#0096AA',
    '#FEFEFE', '#F7F7F7', '#F5F5F5', '#FFFFFF', '#656565', '#585858'
  ]) assert.ok(tokens.includes(hex), `missing palette token ${hex}`);
  assert.match(tokens, /--font-heading:\s*'Ubuntu'/);
  assert.match(tokens, /--font-body:\s*'Montserrat'/);
});

test('keeps the long page semantically and interactively focused', async () => {
  const html = await read('../index.html');
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, 'page must have one h1');
  assert.equal((html.match(/data-faq\b/g) ?? []).length, 7, 'FAQ count changed');
  assert.equal((html.match(/class="comparison"/g) ?? []).length, 3, 'case sliders changed');
  assert.equal((html.match(/data-demo-form/g) ?? []).length, 2, 'consultation forms changed');
  assert.match(html, /<dialog[^>]+aria-labelledby=/, 'consultation dialog needs a name');
  assert.doesNotMatch(html.toLowerCase(), /не обязаны/, 'rejected wording returned');
});

test('contains approved refinement blocks and locked system components', async () => {
  const html = await read('../index.html');
  assert.match(html, /class="paths__cta"/);
  assert.ok(html.indexOf('id="expert"') > html.indexOf('id="cases"'));
  assert.ok(html.indexOf('id="team"') > html.indexOf('id="expert"'));
  assert.equal((html.match(/data-step=/g) ?? []).length, 4);
  assert.match(html, /id="doctors"[^>]+data-locked="true"/);
  assert.match(html, /id="ratings"[^>]+data-locked="true"/);
  assert.match(html, /Запись к врачу/);
});

test('implements the second-iteration desktop and mobile structure', async () => {
  const html = await read('../index.html');
  const content = await read('../assets/js/content.mjs');
  const heroStart = html.indexOf('id="hero"');
  const heroEnd = html.indexOf('</section>', heroStart);
  const factsStart = html.indexOf('class="hero-facts');

  assert.match(html, /Красивая улыбка начинается с точного плана/);
  assert.match(html, /hero-people\.png/);
  assert.ok(factsStart > heroEnd, 'clinic facts must sit below the hero section');
  assert.match(content, /Нужно восстановить зубы/);
  assert.doesNotMatch(content, /Нужно восстановить повреждённые или отсутствующие зубы/);

  const expertStart = html.indexOf('id="expert"');
  const expertEnd = html.indexOf('</section>', expertStart);
  const expertHtml = html.slice(expertStart, expertEnd);
  assert.ok(expertHtml.indexOf('expert__copy') < expertHtml.indexOf('expert__visual'), 'expert copy must precede the doctor');

  const finalStepStart = html.indexOf('data-step-panel="3"');
  const finalStepEnd = html.indexOf('</article>', finalStepStart);
  assert.match(html.slice(finalStepStart, finalStepEnd), /data-open-consultation/);
});

test('uses the supplied responsive team compositions', async () => {
  const html = await read('../index.html');
  const app = await read('../assets/js/app.mjs');

  assert.match(html, /team-desktop\.png/);
  assert.equal((html.match(/class="team-mobile-slide"/g) ?? []).length, 3);
  assert.match(html, /team-mobile-1\.png/);
  assert.match(html, /team-mobile-2\.png/);
  assert.match(html, /team-mobile-3\.png/);
  assert.match(html, /data-team-mobile-prev/);
  assert.match(html, /data-team-mobile-next/);
  assert.match(app, /teamMobileSlides/);
});

test('uses a semantic responsive footer instead of a page-wide snapshot', async () => {
  const html = await read('../index.html');

  assert.match(html, /<footer[^>]+class="site-footer/);
  assert.match(html, /class="container site-footer__grid"/);
  assert.match(html, /class="site-footer__contacts"/);
  assert.match(html, /class="site-footer__socials"/);
  assert.match(html, /class="site-footer__legal"/);
  assert.match(html, /href="tel:\+74852744545"/);
  assert.match(html, /href="mailto:mail@mc-podmoskovie\.ru"/);
  assert.doesNotMatch(html, /footer-desktop-viewport\.png|footer-mobile\.svg/);
  assert.doesNotMatch(html, /site-shell-picture--footer/);
});

test('lays out the semantic footer responsively', async () => {
  const footerCss = await read('../assets/css/footer.css');

  assert.match(footerCss, /\.site-footer__grid\s*\{[^}]*grid-template-columns:/s);
  assert.match(footerCss, /@media \(max-width:\s*767px\)[\s\S]*?\.site-footer__grid\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(footerCss, /\.site-footer__socials\s*\{[^}]*display:\s*flex/s);
});

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

test('uses the approved vector header for desktop and mobile', async () => {
  const html = await read('../index.html');
  const base = await read('../assets/css/base.css');

  assert.match(html, /site-shell\/header-desktop\.svg/);
  assert.match(html, /site-shell\/header-mobile\.svg/);
  assert.doesNotMatch(html, /site-shell\/header-(?:desktop|mobile)\.png/);
  assert.match(base, /aspect-ratio:\s*1920\s*\/\s*107/);
  assert.match(base, /aspect-ratio:\s*390\s*\/\s*115/);
});

test('uses one lower hero glow and an accent clinic-facts band', async () => {
  const html = await read('../index.html');
  const css = await read('../assets/css/components.css');

  assert.equal((html.match(/class="hero__glow/g) ?? []).length, 1);
  assert.match(html, /class="hero-facts hero-facts--accent"/);
  assert.match(css, /\.hero__visual img[^}]+width:\s*13[0-9]%/s);
  assert.match(css, /\.hero-facts--accent/);
});

test('integrates situation photography and reveals paths only on interaction', async () => {
  const html = await read('../index.html');
  const content = await read('../assets/js/content.mjs');
  const css = await read('../assets/css/components.css');

  assert.match(content, /situations\/unified-01\.png/);
  assert.doesNotMatch(html, /path-card--accent/);
  assert.match(css, /\.path-card:is\(:hover,:focus-within\)/);
  assert.match(css, /\.care-cta__inner[^}]+min-height:\s*5[3-9]0px/s);
  assert.match(css, /\.situation-card__photo img[^}]+object-position/s);
});

test('aligns case content and animates expert proof cards', async () => {
  const css = await read('../assets/css/components.css');
  assert.match(css, /\.case-card\s*\{[^}]*display:\s*flex[^}]*flex-direction:\s*column/s);
  assert.match(css, /\.case-card__body\s*\{[^}]*display:\s*grid[^}]*flex:\s*1/s);
  assert.match(css, /\.case-card__body h3\s*\{[^}]*min-height:/s);
  assert.match(css, /\.case-card__body a\s*\{[^}]*margin-top:\s*auto/s);
  assert.match(css, /\.cases__note strong\s*\{[^}]*background:\s*var\(--orange\)/s);
  assert.match(css, /\.expert__proofs li:is\(:hover,:focus-within\)/s);
});

test('uses a full-bleed team artwork and a clean desktop steps visual', async () => {
  const html = await read('../index.html');
  const css = await read('../assets/css/components.css');
  assert.match(html, /section-heading[\s\S]*?<\/div><\/div><div class="team-stage team-stage--full-bleed">/);
  assert.match(css, /\.team-stage--full-bleed\s*\{[^}]*border-radius:\s*0/s);
  assert.doesNotMatch(css, /\.steps-route__panels article::after\s*\{[^}]*clip-path:/s);
});

test('implements the fourth desktop refinement contract', async () => {
  const html = await read('../index.html');
  const css = await read('../assets/css/components.css');
  const content = await read('../assets/js/content.mjs');

  assert.ok((html.match(/class="desktop-break"/g) ?? []).length >= 4);
  assert.match(css, /\.desktop-break\s*\{[^}]*display:/s);
  assert.match(css, /\.hero-facts--accent\s*\{/s);
  assert.doesNotMatch(css, /\.hero-facts--accent::after/);
  assert.match(css, /\.situation-card\s*\{[^}]*background:\s*#F5F5F5/s);
  assert.match(css, /\.path-card\s*\{[^}]*transition:[^}]*480ms/s);
  assert.equal((html.match(/class="steps-route__visual"/g) ?? []).length, 4);
  for (let index = 1; index <= 6; index += 1) {
    assert.match(content, new RegExp(`situations/unified-0${index}\\.png`));
  }
});

test('implements the visual seams refinement contract', async () => {
  const css = await read('../assets/css/components.css');

  assert.match(css, /\.hero__glow--one\s*\{[^}]*width:\s*420px[^}]*height:\s*420px/s);
  assert.match(css, /\.hero__glow\s*\{[^}]*rgb\(148 214 220 \/ 28%\)/s);
  assert.match(css, /\.hero-facts--accent\s*\{[^}]*background:\s*#F5F5F5/s);
  assert.match(css, /\.hero-facts li\s*\{/s);
  assert.match(css, /\.hero-facts strong\s*\{/s);
  assert.match(css, /\.hero-facts span\s*\{/s);
  assert.doesNotMatch(css, /\.hero-facts li::before\s*\{/s);
  assert.match(css, /\.situation-card__photo::before\s*\{[^}]*linear-gradient\(90deg,#F5F5F5/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.situation-card__photo::before\s*\{[^}]*display:\s*block/s);
});

test('implements the approved mobile refinement contract', async () => {
  const css = await read('../assets/css/components.css');
  const content = await read('../assets/js/content.mjs');

  assert.match(css, /\.hero-facts li\s*\{[^}]*border:\s*1px solid #1FBBC7[^}]*background:\s*var\(--white\)/s);
  assert.doesNotMatch(css, /\.hero-facts li::before\s*\{/s);
  assert.match(css, /\.hero-facts strong\s*\{[^}]*color:\s*var\(--turquoise-dark\)/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.hero-facts ul\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.situation-card\s*\{[^}]*min-height:\s*188px/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.situation-card__front\s*\{[^}]*44%/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.situation-card__title\s*\{[^}]*font-size:\s*19px/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.care-cta__doctor\s*\{[^}]*min-height:\s*420px[^}]*margin-top:\s*36px/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.steps-route__visual\s*\{[^}]*display:\s*block[^}]*height:\s*210px/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.steps-route__visual\s*\{[^}]*border-bottom:\s*4px solid #94D6DC/s);
  for (let index = 1; index <= 6; index += 1) {
    assert.match(content, new RegExp(`situations/unified-0${index}\\.png\\?v=mobile2`));
  }
});

test('keeps all mobile step panels equally compact with larger imagery', async () => {
  const css = await read('../assets/css/components.css');

  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.steps-route__panels\s*\{[^}]*min-height:\s*500px/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.steps-route__panels article\s*\{[^}]*min-height:\s*500px[^}]*padding:\s*246px 20px 20px/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.steps-route__visual\s*\{[^}]*height:\s*210px/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.steps-route__panels article::before[^}]*top:\s*219px/s);
  assert.match(css, /@media \(max-width:\s*767px\)[\s\S]*?\.steps-route__panels article:last-child h3\s*\{[^}]*font-size:\s*24px/s);
});

test('blends mobile situation photography into the card background', async () => {
  const css = await read('../assets/css/components.css');

  assert.match(
    css,
    /@media \(max-width:\s*767px\)[\s\S]*?\.situation-card__photo::before\s*\{[^}]*display:\s*block[^}]*width:\s*28%[^}]*background:\s*linear-gradient\(90deg,#F5F5F5/s,
  );
  assert.doesNotMatch(
    css,
    /@media \(max-width:\s*767px\)[\s\S]*?\.situation-card__photo::before\s*\{[^}]*display:\s*none/s,
  );
});

test('gives expanded mobile situation cards enough room for their content', async () => {
  const css = await read('../assets/css/components.css');

  assert.match(
    css,
    /\.situation-card\s*\{[^}]*transition:[^}]*min-height/s,
  );
  assert.match(
    css,
    /@media \(max-width:\s*767px\)[\s\S]*?\.situation-card\[aria-expanded="true"\]\s*\{[^}]*min-height:\s*300px/s,
  );
  assert.match(
    css,
    /@media \(max-width:\s*767px\)[\s\S]*?\.situation-card__back strong\s*\{[^}]*font-size:\s*23px/s,
  );
});
