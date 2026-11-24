import { Link } from 'react-router-dom';
import styles from './StatsStrip.module.css';

/** A row of figures separated by hairlines. `to` makes an item a link. */
export default function StatsStrip({ items }) {
  return (
    <ul className={styles.strip}>
      {items.map(({ label, value, hint, to }) => {
        const content = (
          <>
            <span className={styles.value}>{value}</span>
            <span className={styles.label}>{label}</span>
            {hint && <span className={styles.hint}>{hint}</span>}
          </>
        );
        return (
          <li className={styles.item} key={label}>
            {to ? (
              <Link to={to} className={styles.inner}>
                {content}
              </Link>
            ) : (
              <div className={styles.inner}>{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
