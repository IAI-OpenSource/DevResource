import { DEFAULT_SORT } from './constants.js';

// Pure helpers that compute everything the UI displays from the resource list.
// Nothing here is hardcoded: add a JSON file and the numbers update.

const normalize = (text) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export const contributorKey = (name) => name.trim().toLowerCase();

/** Resources are counted once, even when they belong to several categories. */
export function getStats(resources) {
  const categories = new Set();
  const contributors = new Set();
  const byTrack = { ASR: 0, GLSI: 0 };

  for (const resource of resources) {
    resource.categories.forEach((category) => categories.add(category));
    contributors.add(contributorKey(resource.addedBy));
    byTrack[resource.track] += 1;
  }

  return {
    totalResources: resources.length,
    totalCategories: categories.size,
    totalContributors: contributors.size,
    byTrack,
  };
}

/** [{ name, count }] sorted by popularity. A multi-category resource counts in each of its categories. */
export function getCategoryCounts(resources) {
  const counts = new Map();
  for (const resource of resources) {
    for (const category of resource.categories) {
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** [{ key, name, count, resources }] sorted by number of contributions. */
export function getContributors(resources) {
  const groups = new Map();
  for (const resource of resources) {
    const key = contributorKey(resource.addedBy);
    if (!groups.has(key)) groups.set(key, { key, name: resource.addedBy, resources: [] });
    groups.get(key).resources.push(resource);
  }
  return [...groups.values()]
    .map((group) => ({
      ...group,
      resources: [...group.resources].sort((a, b) => a.name.localeCompare(b.name)),
      count: group.resources.length,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function filterResources(resources, { query = '', category = '', track = '' } = {}) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);

  return resources.filter((resource) => {
    if (category && !resource.categories.includes(category)) return false;
    if (track && resource.track !== track) return false;
    if (terms.length === 0) return true;
    const haystack = normalize(`${resource.name} ${resource.description}`);
    return terms.every((term) => haystack.includes(term));
  });
}

// A resource without `addedAt` is treated as "just added", so a contributor
// who forgets the date still sees their resource at the top.
const addedTime = (resource) =>
  resource.addedAt ? Date.parse(`${resource.addedAt}T00:00:00Z`) : Number.POSITIVE_INFINITY;

const byName = (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });

export function sortResources(resources, sort = DEFAULT_SORT) {
  const list = [...resources];
  switch (sort) {
    case 'name-asc':
      return list.sort(byName);
    case 'name-desc':
      return list.sort((a, b) => byName(b, a));
    case 'contributor':
      return list.sort(
        (a, b) =>
          a.addedBy.localeCompare(b.addedBy, undefined, { sensitivity: 'base' }) || byName(a, b),
      );
    case 'newest':
    default:
      return list.sort((a, b) => {
        const ta = addedTime(a);
        const tb = addedTime(b);
        if (ta === tb) return byName(a, b);
        return tb > ta ? 1 : -1;
      });
  }
}

export function getRecentResources(resources, limit = 3) {
  return sortResources(resources, 'newest').slice(0, limit);
}

export function getRelatedResources(resources, resource, limit = 3) {
  return resources
    .filter(
      (other) =>
        other.id !== resource.id &&
        other.categories.some((category) => resource.categories.includes(category)),
    )
    .slice(0, limit);
}

export function formatDate(isoDate) {
  if (!isoDate) return '';
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function getHostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
