import { useEffect, useMemo, useRef } from 'react';
import { FolderOpen, SearchX } from 'lucide-react';
import Button from '../components/Button';
import ChipGroup from '../components/ChipGroup';
import EmptyState from '../components/EmptyState';
import ResourceGrid from '../components/ResourceGrid';
import SearchInput from '../components/SearchInput';
import SegmentedControl from '../components/SegmentedControl';
import Select from '../components/Select';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useResourceFilters } from '../hooks/useResourceFilters';
import { useResources } from '../hooks/useResources';
import { SORT_OPTIONS, TRACKS } from '../utils/constants';
import { filterResources, getCategoryCounts, sortResources } from '../utils/resourceStats';
import styles from './ResourcesPage.module.css';

const trackOptions = [{ value: '', label: 'All' }, ...TRACKS.map((t) => ({ value: t, label: t }))];
const sortOptions = Object.entries(SORT_OPTIONS).map(([value, label]) => ({ value, label }));

export default function ResourcesPage() {
  useDocumentTitle('Resources');
  const { resources } = useResources();
  const { filters, hasActiveFilters, setQuery, setCategory, setTrack, setSort, reset } =
    useResourceFilters();
  const searchRef = useRef(null);

  // Keyboard shortcut: press "/" anywhere to jump to the search field.
  useEffect(() => {
    const onKeyDown = (event) => {
      const target = event.target;
      const typing = target.matches?.('input, textarea, select, [contenteditable]');
      if (event.key === '/' && !typing && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Only offer categories that actually contain resources.
  const categoryOptions = useMemo(
    () => [
      { value: '', label: 'All', count: resources.length },
      ...getCategoryCounts(resources).map(({ name, count }) => ({ value: name, label: name, count })),
    ],
    [resources],
  );

  const visible = useMemo(
    () => sortResources(filterResources(resources, filters), filters.sort),
    [resources, filters],
  );

  const activeCategoryMissing =
    filters.category && !categoryOptions.some((option) => option.value === filters.category);

  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>Resources</h1>
        <p className={styles.lead}>
          Search the directory, or narrow it down by category and academic track.
        </p>
      </header>

      <div className={styles.controls}>
        <SearchInput
          ref={searchRef}
          value={filters.query}
          onChange={setQuery}
          placeholder="Search by name or description  ( / )"
        />
        <ChipGroup
          label="Filter by category"
          options={categoryOptions}
          value={activeCategoryMissing ? '' : filters.category}
          onChange={setCategory}
        />
        <div className={styles.row}>
          <div className={styles.track}>
            <span className={styles.rowLabel}>
              Track
            </span>
            <SegmentedControl
              label="Filter by academic track"
              options={trackOptions}
              value={filters.track}
              onChange={setTrack}
            />
          </div>
          <Select label="Sort by" value={filters.sort} onChange={setSort} options={sortOptions} />
        </div>
      </div>

      <div className={styles.results}>
        <p className={styles.count} aria-live="polite" aria-atomic="true">
          {resources.length === 0
            ? ''
            : `Showing ${visible.length} of ${resources.length} ${resources.length === 1 ? 'resource' : 'resources'}`}
        </p>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={reset}>
            Clear filters
          </Button>
        )}
      </div>

      {resources.length === 0 ? (
        <EmptyState icon={<FolderOpen size={22} aria-hidden="true" />} title="No resources yet">
          Add a JSON file to <code>src/data/resources/</code> and it will show up here
          automatically.
        </EmptyState>
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<SearchX size={22} aria-hidden="true" />}
          title="No matching resources"
          action={
            <Button variant="secondary" onClick={reset}>
              Clear all filters
            </Button>
          }
        >
          Nothing matches your current search and filters. Try different keywords, or remove a
          filter.
        </EmptyState>
      ) : (
        <ResourceGrid resources={visible} />
      )}
    </div>
  );
}
