import { getResourceCollection } from '../utils/loadResources';

/**
 * Gives any component access to the validated resources.
 * `{ resources, issues, invalidFiles, totalFiles }`
 */
export function useResources() {
  return getResourceCollection();
}
