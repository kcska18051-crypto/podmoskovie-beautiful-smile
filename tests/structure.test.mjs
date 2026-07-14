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
  const factsStart = html.indexOf('class="hero-facts"');

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

test('frames the prototype with responsive snapshots of the live site shell', async () => {
  const html = await read('../index.html');

  assert.match(html, /site-shell\/header-desktop\.png/);
  assert.match(html, /site-shell\/header-mobile\.png/);
  assert.match(html, /site-shell\/footer-desktop-viewport\.png/);
  assert.match(html, /site-shell\/footer-mobile\.png/);
  assert.match(html, /<picture class="site-shell-picture site-shell-picture--header">/);
  assert.match(html, /<picture class="site-shell-picture site-shell-picture--footer">/);
});
