import { buildResourceCollection } from './resourceCollection.js';

// ─────────────────────────────────────────────────────────────────────────
// Automatic discovery of resource files.
//
// Vite finds every `*.json` file in src/data/resources/ at build time, so
// contributors only need to ADD a file: no import, no list to update.
//
// We import the files as raw text (`?raw`) and parse them ourselves. That
// way a typo such as a trailing comma becomes a readable validation message
// instead of crashing the whole app.
// ─────────────────────────────────────────────────────────────────────────
const resourceFiles = import.meta.glob('../data/resources/*.json', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const entries = Object.entries(resourceFiles).map(([path, raw]) => ({
  fileName: path.split('/').pop(),
  raw,
}));

const collection = buildResourceCollection(entries);

if (import.meta.env.DEV && collection.issues.length > 0) {
  for (const { fileName, level, message } of collection.issues) {
    const log = level === 'error' ? console.error : console.warn;
    log(`[DevResources] ${fileName}: ${message}`);
  }
}

/** The validated resources plus any problems found while loading them. */
export function getResourceCollection() {
  return collection;
}
