import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getStats,
  getCategoryCounts,
  getContributors,
  filterResources,
  sortResources,
} from '../src/utils/resourceStats.js';

const make = (id, categories, track, addedBy, extra = {}) => ({
  id,
  name: id.toUpperCase(),
  description: `Description of ${id} café`,
  categories,
  track,
  addedBy,
  url: 'https://example.com',
  imageUrl: 'https://example.com/i.svg',
  addedAt: null,
  ...extra,
});

const resources = [
  make('a', ['Frontend', 'Development Tools'], 'GLSI', 'Isaac', { addedAt: '2026-01-01' }),
  make('b', ['Frontend'], 'ASR', 'isaac', { addedAt: '2026-03-01' }),
  make('c', ['Database', 'Backend', 'Frontend'], 'ASR', 'Ama', { addedAt: '2026-02-01' }),
];

test('total counts each resource once even with several categories', () => {
  const stats = getStats(resources);
  assert.equal(stats.totalResources, 3);
  assert.equal(stats.totalCategories, 4);
  assert.equal(stats.totalContributors, 2); // Isaac / isaac are the same person
  assert.deepEqual(stats.byTrack, { ASR: 2, GLSI: 1 });
});

test('category counts count a resource in each of its categories', () => {
  const counts = getCategoryCounts(resources);
  assert.deepEqual(counts[0], { name: 'Frontend', count: 3 });
  assert.equal(counts.reduce((sum, c) => sum + c.count, 0), 6);
});

test('contributors are grouped case-insensitively', () => {
  const [first] = getContributors(resources);
  assert.equal(first.count, 2);
  assert.equal(first.name, 'Isaac');
});

test('filters combine: query, one category, track', () => {
  assert.equal(filterResources(resources, { category: 'Frontend' }).length, 3);
  assert.equal(filterResources(resources, { category: 'Frontend', track: 'ASR' }).length, 2);
  assert.equal(filterResources(resources, { query: 'CAFE' }).length, 3); // accent/case-insensitive
  assert.equal(filterResources(resources, { query: 'zzz' }).length, 0);
  assert.equal(filterResources(resources, { query: 'description b' }).length, 1);
});

test('sorting', () => {
  assert.deepEqual(sortResources(resources, 'newest').map((r) => r.id), ['b', 'c', 'a']);
  assert.deepEqual(sortResources(resources, 'name-desc').map((r) => r.id), ['c', 'b', 'a']);
  const withUndated = [...resources, make('d', ['Frontend'], 'ASR', 'Z')];
  assert.equal(sortResources(withUndated, 'newest')[0].id, 'd'); // no date = just added
});
