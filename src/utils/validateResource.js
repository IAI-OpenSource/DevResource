import {
  CATEGORIES,
  TRACKS,
  REQUIRED_FIELDS,
  OPTIONAL_FIELDS,
} from './constants.js';

// Validation for ONE resource. Pure functions: no React, no file access,
// so the same code runs in the browser and in `npm run validate`.

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const isText = (value) => typeof value === 'string' && value.trim().length > 0;

export function isHttpUrl(value) {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function isRealDate(value) {
  if (!DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

function checkCategories(categories, errors) {
  if (!Array.isArray(categories)) {
    errors.push('"categories" must be an array, e.g. ["Frontend", "Development Tools"].');
    return;
  }
  if (categories.length === 0) {
    errors.push('"categories" must contain at least one category.');
    return;
  }

  const seen = new Set();
  for (const category of categories) {
    if (typeof category !== 'string') {
      errors.push(`Every category must be a string (found ${JSON.stringify(category)}).`);
      continue;
    }
    if (!CATEGORIES.includes(category)) {
      const suggestion = CATEGORIES.find(
        (allowed) => allowed.toLowerCase() === category.trim().toLowerCase(),
      );
      errors.push(
        suggestion
          ? `Unknown category "${category}". Did you mean "${suggestion}"? Categories must match exactly.`
          : `Unknown category "${category}". Allowed categories: ${CATEGORIES.join(', ')}.`,
      );
      continue;
    }
    if (seen.has(category)) {
      errors.push(`Duplicate category "${category}" in "categories".`);
    }
    seen.add(category);
  }
}

/**
 * Validate the parsed content of one JSON file.
 * @param {unknown} data       The parsed JSON.
 * @param {string}  fileName   e.g. "react.json" (used to check the id).
 * @returns {{ resource: object|null, errors: string[], warnings: string[] }}
 */
export function validateResource(data, fileName = '') {
  const errors = [];
  const warnings = [];

  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    return {
      resource: null,
      errors: ['The file must contain one JSON object ({ ... }), not an array or a single value.'],
      warnings,
    };
  }

  // Required properties: present, and not empty.
  for (const field of REQUIRED_FIELDS) {
    if (!(field in data)) {
      errors.push(
        field === 'categories' && 'category' in data
          ? 'Missing "categories". Use an array named "categories" instead of "category".'
          : `Missing required property "${field}".`,
      );
    }
  }

  // Text fields.
  for (const field of ['id', 'name', 'description', 'addedBy']) {
    if (field in data && !isText(data[field])) {
      errors.push(`"${field}" must be a non-empty string.`);
    }
  }

  // id: lowercase slug (it is used in the page address) matching the file name.
  if (isText(data.id)) {
    if (!SLUG_PATTERN.test(data.id.trim())) {
      errors.push(
        `"id" ("${data.id}") must be lowercase letters, numbers and hyphens only, e.g. "mdn-web-docs".`,
      );
    } else if (fileName && `${data.id.trim()}.json` !== fileName) {
      warnings.push(
        `"id" ("${data.id}") should match the file name ("${fileName}"). Rename the file or change the id.`,
      );
    }
  }

  if ('categories' in data) checkCategories(data.categories, errors);

  if ('track' in data && !TRACKS.includes(data.track)) {
    errors.push(
      `Invalid track ${JSON.stringify(data.track)}. It must be exactly "ASR" or "GLSI" (uppercase).`,
    );
  }

  for (const field of ['url', 'imageUrl']) {
    if (field in data && !isHttpUrl(data[field])) {
      errors.push(`"${field}" must be a valid http(s) URL (found ${JSON.stringify(data[field])}).`);
    }
  }

  // Optional: addedAt
  if ('addedAt' in data && !(typeof data.addedAt === 'string' && isRealDate(data.addedAt))) {
    errors.push(`"addedAt" must be a real date written as YYYY-MM-DD (found ${JSON.stringify(data.addedAt)}).`);
  }

  // Unknown properties are harmless, but probably typos.
  const known = new Set([...REQUIRED_FIELDS, ...OPTIONAL_FIELDS]);
  for (const key of Object.keys(data)) {
    if (!known.has(key) && !(key === 'category' && !('categories' in data))) {
      warnings.push(`Unknown property "${key}" will be ignored.`);
    }
  }

  if (errors.length > 0) return { resource: null, errors, warnings };

  const resource = {
    id: data.id.trim(),
    name: data.name.trim(),
    description: data.description.trim(),
    categories: [...data.categories],
    track: data.track,
    addedBy: data.addedBy.trim(),
    url: data.url.trim(),
    imageUrl: data.imageUrl.trim(),
    addedAt: data.addedAt ?? null,
  };
  return { resource, errors, warnings };
}
