import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES, TRACKS, SORT_OPTIONS, DEFAULT_SORT } from '../utils/constants';

/**
 * Keeps the Resources page filters in the URL (?q=…&category=…&track=…&sort=…),
 * so a filtered view can be shared, bookmarked, and survives a refresh.
 * Unknown or tampered values fall back to "no filter".
 */
export function useResourceFilters() {
  const [params, setParams] = useSearchParams();

  const category = params.get('category') ?? '';
  const track = params.get('track') ?? '';
  const sort = params.get('sort') ?? '';

  const filters = {
    query: params.get('q') ?? '',
    category: CATEGORIES.includes(category) ? category : '',
    track: TRACKS.includes(track) ? track : '',
    sort: sort in SORT_OPTIONS ? sort : DEFAULT_SORT,
  };

  const update = useCallback(
    (key, value) => {
      setParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          if (value) next.set(key, value);
          else next.delete(key);
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const hasActiveFilters = Boolean(filters.query.trim() || filters.category || filters.track);

  return {
    filters,
    hasActiveFilters,
    setQuery: (value) => update('q', value),
    setCategory: (value) => update('category', value),
    setTrack: (value) => update('track', value),
    setSort: (value) => update('sort', value === DEFAULT_SORT ? '' : value),
    reset: () => setParams({}, { replace: true }),
  };
}
