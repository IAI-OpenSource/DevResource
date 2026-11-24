import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, SearchX } from 'lucide-react';
import { CategoryBadge, TrackBadge } from '../components/Badge';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import ResourceGrid from '../components/ResourceGrid';
import ResourceImage from '../components/ResourceImage';
import SectionHeader from '../components/SectionHeader';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useResources } from '../hooks/useResources';
import { TRACK_LABELS } from '../utils/constants';
import { formatDate, getHostname, getRelatedResources } from '../utils/resourceStats';
import styles from './ResourceDetailPage.module.css';

export default function ResourceDetailPage() {
  const { id } = useParams();
  const { resources } = useResources();
  const resource = resources.find((item) => item.id === id);

  useDocumentTitle(resource ? resource.name : 'Resource not found');

  if (!resource) {
    return (
      <div className={`container ${styles.page}`}>
        <EmptyState
          icon={<SearchX size={22} aria-hidden="true" />}
          title="Resource not found"
          action={
            <Button as={Link} to="/resources" variant="secondary">
              Back to resources
            </Button>
          }
        >
          We couldn&apos;t find a resource with the id <code>{id}</code>. It may have been renamed
          or removed.
        </EmptyState>
      </div>
    );
  }

  const { name, description, categories, track, addedBy, url, imageUrl, addedAt } = resource;
  const related = getRelatedResources(resources, resource);

  return (
    <div className={`container ${styles.page}`}>
      <Button
        as={Link}
        to="/resources"
        variant="ghost"
        size="sm"
        className={styles.back}
        icon={null}
      >
        <ArrowLeft size={14} aria-hidden="true" /> All resources
      </Button>

      <article className={styles.card}>
        <header className={styles.hero}>
          <ResourceImage src={imageUrl} name={name} size="lg" />
          <div className={styles.heading}>
            <h1 className={styles.title}>{name}</h1>
            <p className={styles.host}>{getHostname(url)}</p>
          </div>
        </header>

        <p className={styles.description}>{description}</p>

        <Button
          as="a"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          icon={<ArrowUpRight size={16} aria-hidden="true" />}
        >
          Visit {name}
        </Button>

        <dl className={styles.meta}>
          <div>
            <dt>{categories.length > 1 ? 'Categories' : 'Category'}</dt>
            <dd>
              <ul className={styles.badges}>
                {categories.map((category) => (
                  <li key={category}>
                    <Link to={`/resources?category=${encodeURIComponent(category)}`}>
                      <CategoryBadge>{category}</CategoryBadge>
                    </Link>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt>Academic track</dt>
            <dd className={styles.track}>
              <TrackBadge track={track} />
              <span>{TRACK_LABELS[track]}</span>
            </dd>
          </div>
          <div>
            <dt>Contributor</dt>
            <dd>
              <Link
                to={`/contributors?name=${encodeURIComponent(addedBy)}`}
                className={styles.contributor}
              >
                {addedBy}
              </Link>
            </dd>
          </div>
          {addedAt && (
            <div>
              <dt>Added</dt>
              <dd>{formatDate(addedAt)}</dd>
            </div>
          )}
          <div>
            <dt>Link</dt>
            <dd className={styles.url}>{url}</dd>
          </div>
        </dl>
      </article>

      {related.length > 0 && (
        <section className={styles.related}>
          <SectionHeader title="More like this" description="Resources sharing a category." />
          <ResourceGrid resources={related} />
        </section>
      )}
    </div>
  );
}
