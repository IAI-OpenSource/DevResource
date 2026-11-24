import { validateResource } from './validateResource.js';

/**
 * Turn raw JSON files into a clean list of resources.
 *
 * A broken file NEVER throws: it is skipped and reported in `issues`,
 * so one bad contribution cannot break the whole application.
 *
 * @param {{ fileName: string, raw: string }[]} entries  `raw` is the file's text.
 * @returns {{ resources: object[], issues: object[], invalidFiles: number, totalFiles: number }}
 */
export function buildResourceCollection(entries) {
  const resources = [];
  const issues = [];
  const invalidFiles = new Set();
  const idOwners = new Map(); // id -> file name of the first file using it

  // Sorted by file name so the result is the same on every machine.
  const sorted = [...entries].sort((a, b) => a.fileName.localeCompare(b.fileName));

  for (const { fileName, raw } of sorted) {
    let data;
    try {
      data = JSON.parse(raw);
    } catch (error) {
      issues.push({
        fileName,
        level: 'error',
        message: `Invalid JSON syntax: ${error.message}. Check for missing quotes, commas or brackets (and no trailing comma).`,
      });
      invalidFiles.add(fileName);
      continue;
    }

    const { resource, errors, warnings } = validateResource(data, fileName);
    for (const message of warnings) issues.push({ fileName, level: 'warning', message });
    for (const message of errors) issues.push({ fileName, level: 'error', message });

    if (!resource) {
      invalidFiles.add(fileName);
      continue;
    }

    if (idOwners.has(resource.id)) {
      issues.push({
        fileName,
        level: 'error',
        message: `Duplicate id "${resource.id}": already used by "${idOwners.get(resource.id)}". Every id must be unique.`,
      });
      invalidFiles.add(fileName);
      continue;
    }

    idOwners.set(resource.id, fileName);
    resources.push(resource);
  }

  return {
    resources,
    issues,
    invalidFiles: invalidFiles.size,
    totalFiles: entries.length,
  };
}
