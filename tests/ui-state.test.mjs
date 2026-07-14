import test from 'node:test';
import assert from 'node:assert/strict';
import { toggleExclusive, clampPercent, pairPageCount, movePage, activateStep } from '../assets/js/ui-state.mjs';

test('opens one item and closes it on repeat click', () => {
  assert.equal(toggleExclusive(null, 'color'), 'color');
  assert.equal(toggleExclusive('color', 'color'), null);
  assert.equal(toggleExclusive('color', 'shape'), 'shape');
});

test('comparison position remains within visible bounds', () => {
  assert.equal(clampPercent(-10), 0);
  assert.equal(clampPercent(42), 42);
  assert.equal(clampPercent(120), 100);
  assert.equal(clampPercent('bad'), 0);
});

test('doctor pages pair items and wrap predictably', () => {
  assert.equal(pairPageCount(5, 2), 3);
  assert.equal(movePage(0, -1, 3), 2);
  assert.equal(movePage(2, 1, 3), 0);
});

test('step route accepts only a valid requested step', () => {
  assert.equal(activateStep(0, 2, 4), 2);
  assert.equal(activateStep(2, -1, 4), 2);
  assert.equal(activateStep(2, 4, 4), 2);
  assert.equal(activateStep(2, Number.NaN, 4), 2);
});
