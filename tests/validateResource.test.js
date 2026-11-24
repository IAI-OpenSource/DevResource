import test from 'node:test';
import assert from 'node:assert/strict';
import { validateResource } from '../src/utils/validateResource.js';
import { buildResourceCollection } from '../src/utils/resourceCollection.js';

const valid = {
  id: 'react',
  name: 'React',
  description: 'A UI library.',
  categories: ['Frontend', 'Development Tools'],
  track: 'GLSI',
  addedBy: 'Isaac',
  url: 'https://react.dev',
  imageUrl: 'https://cdn.simpleicons.org/react',
};

const errorsFor = (changes, remove = []) => {
  const data = { ...valid, ...changes };
  remove.forEach((key) => delete data[key]);
  return validateResource(data, 'react.json').errors;
};

test('accepts a valid resource', () => {
  const { resource, errors } = validateResource(valid, 'react.json');
  assert.deepEqual(errors, []);
  assert.equal(resource.id, 'react');
});

test('reports every missing required property', () => {
  const { errors } = validateResource({}, 'x.json');
  assert.equal(errors.length, 8);
});

test('rejects invalid tracks (case sensitive)', () => {
  assert.equal(errorsFor({ track: 'asr' }).length, 1);
  assert.equal(errorsFor({ track: 'Other' }).length, 1);
});

test('rejects invalid urls', () => {
  assert.equal(errorsFor({ url: 'react.dev' }).length, 1);
  assert.equal(errorsFor({ imageUrl: 'javascript:alert(1)' }).length, 1);
});

test('categories: must be a non-empty array of approved values', () => {
  assert.equal(errorsFor({ categories: [] }).length, 1);
  assert.equal(errorsFor({ categories: 'Frontend' }).length, 1);
  assert.equal(errorsFor({ categories: ['Web'] }).length, 1);
  assert.match(errorsFor({ categories: ['frontend'] })[0], /Did you mean "Frontend"/);
});

test('categories: duplicates are rejected', () => {
  const errors = errorsFor({ categories: ['Frontend', 'Frontend'] });
  assert.equal(errors.length, 1);
  assert.match(errors[0], /Duplicate/);
});

test('old singular "category" property gets a helpful message', () => {
  const errors = errorsFor({}, ['categories']);
  assert.match(errors[0], /categories/);
});

test('id must be a slug; mismatch with file name is only a warning', () => {
  assert.equal(errorsFor({ id: 'Not A Slug' }).length, 1);
  const { errors, warnings } = validateResource({ ...valid, id: 'other' }, 'react.json');
  assert.equal(errors.length, 0);
  assert.equal(warnings.length, 1);
});

test('addedAt is optional but must be a real date', () => {
  assert.equal(errorsFor({ addedAt: '2026-02-30' }).length, 1);
  assert.equal(errorsFor({ addedAt: '2026-11-24' }).length, 0);
});

test('collection: bad files are skipped, never thrown', () => {
  const entries = [
    { fileName: 'react.json', raw: JSON.stringify(valid) },
    { fileName: 'broken.json', raw: '{ "id": "x", }' },
    { fileName: 'dup.json', raw: JSON.stringify({ ...valid, name: 'Copy' }) },
    { fileName: 'bad-track.json', raw: JSON.stringify({ ...valid, id: 'bad-track', track: 'X' }) },
  ];
  const { resources, issues, invalidFiles } = buildResourceCollection(entries);
  assert.equal(resources.length, 1);
  assert.equal(invalidFiles, 3);
  assert.ok(issues.some((i) => i.fileName === 'broken.json' && /JSON syntax/.test(i.message)));
  // Files are read alphabetically: dup.json keeps the id, react.json is the duplicate.
  assert.ok(issues.some((i) => i.fileName === 'react.json' && /Duplicate id/.test(i.message)));
});
