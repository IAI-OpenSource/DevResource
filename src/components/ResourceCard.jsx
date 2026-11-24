import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import ResourceImage from './ResourceImage';
import { CategoryBadge, TrackBadge } from './Badge';
import styles from './ResourceCard.module.css';

const VISIBLE_CATEGORIES = 2;

export default function ResourceCard({ resource }) {
  const { id, name, description, categories, track, addedBy, url, imageUrl } = resource;
  const hidden = categories.slice(VISIBLE_CATEGORIES);

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <ResourceImage src={imageUrl} name={name} />
        <TrackBadge track={track} />
      </div>

      <h3 className={styles.name}>
        {/* The ::after of this link covers the whole card, making it all clickable. */}
        <Link to={`/resources/${id}`} className={styles.link}>
          {name}
        </Link>
      </h3>
      <p className={styles.description}>{description}</p>

      <ul className={styles.badges} aria-label="Categories">
        {categories.slice(0, VISIBLE_CATEGORIES).map((category) => (
          <li key={category}>
            <CategoryBadge>{category}</CategoryBadge>
          </li>
        ))}
        {hidden.length > 0 && (
          <li title={hidden.join(', ')}>
            <CategoryBadge>+{hidden.length}</CategoryBadge>
          </li>
        )}
      </ul>

      <div className={styles.footer}>
        <span className={styles.contributor}>
          by <strong>{addedBy}</strong>
        </span>
        <a
          className={styles.open}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${name} (opens in a new tab)`}
        >
          Open <ExternalLink size={14} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
