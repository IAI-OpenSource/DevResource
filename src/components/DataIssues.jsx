import { TriangleAlert } from 'lucide-react';
import styles from './DataIssues.module.css';

/**
 * Developer-only notice (hidden in production builds) listing JSON files that
 * were skipped, so contributors can see why their resource is missing.
 */
export default function DataIssues({ issues }) {
  if (!import.meta.env.DEV || issues.length === 0) return null;

  const hasError = issues.some((issue) => issue.level === 'error');
  return (
    <div className="container">
      <details className={styles.box} open={hasError}>
        <summary className={styles.summary}>
          <TriangleAlert size={16} aria-hidden="true" />
          {issues.length} problem{issues.length > 1 ? 's' : ''} found in src/data/resources/
          <span className={styles.note}>(only visible in development)</span>
        </summary>
        <ul className={styles.list}>
          {issues.map((issue, index) => (
            <li key={index}>
              <code>{issue.fileName}</code>{' '}
              <span className={issue.level === 'error' ? styles.error : styles.warning}>
                {issue.level}
              </span>{' '}
              {issue.message}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
