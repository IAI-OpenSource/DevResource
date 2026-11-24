import { Link, useSearchParams } from 'react-router-dom';
import { Users } from 'lucide-react';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import ResourceImage from '../components/ResourceImage';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useResources } from '../hooks/useResources';
import { contributorKey, getContributors } from '../utils/resourceStats';
import styles from './ContributorsPage.module.css';

export default function ContributorsPage() {
  useDocumentTitle('Contributors');
  const { resources } = useResources();
  const [params] = useSearchParams();

  const all = getContributors(resources);
  const selected = params.get('name');
  // `?name=` (set from a resource page) shows a single contributor.
  const contributors = selected
    ? all.filter((contributor) => contributor.key === contributorKey(selected))
    : all;

  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>Contributors</h1>
        <p className={styles.lead}>
          {all.length > 0
            ? `${all.length} ${all.length === 1 ? 'person has' : 'people have'} shared ${resources.length} ${resources.length === 1 ? 'resource' : 'resources'} with the community.`
            : 'The people who add resources will be listed here.'}
        </p>
        {selected && (
          <Button as={Link} to="/contributors" variant="ghost" size="sm" className={styles.all}>
            Show all contributors
          </Button>
        )}
      </header>

      {contributors.length === 0 ? (
        <EmptyState
          icon={<Users size={22} aria-hidden="true" />}
          title={selected ? 'Contributor not found' : 'No contributors yet'}
          action={
            selected && (
              <Button as={Link} to="/contributors" variant="secondary">
                Show all contributors
              </Button>
            )
          }
        >
          {selected
            ? `Nobody named "${selected}" has contributed a resource.`
            : 'Contributors appear automatically from the "addedBy" field of each resource.'}
        </EmptyState>
      ) : (
        <ul className={styles.list}>
          {contributors.map((contributor) => (
            <li key={contributor.key} className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.name}>{contributor.name}</h2>
                <p className={styles.count}>
                  <strong>{contributor.count}</strong>{' '}
                  {contributor.count === 1 ? 'resource' : 'resources'}
                </p>
              </div>
              <ul className={styles.resources}>
                {contributor.resources.map((resource) => (
                  <li key={resource.id}>
                    <Link to={`/resources/${resource.id}`} className={styles.resource}>
                      <ResourceImage src={resource.imageUrl} name={resource.name} size="sm" />
                      <span className={styles.resourceName}>{resource.name}</span>
                      <span className={styles.resourceMeta}>{resource.categories.join(' · ')}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
