import { TRACK_LABELS } from '../utils/constants';
import styles from './Badge.module.css';

export function CategoryBadge({ children }) {
  return <span className={`${styles.badge} ${styles.category}`}>{children}</span>;
}

export function TrackBadge({ track }) {
  return (
    <abbr className={`${styles.badge} ${styles.track}`} title={TRACK_LABELS[track]}>
      {track}
    </abbr>
  );
}
