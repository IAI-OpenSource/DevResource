import ResourceCard from './ResourceCard';
import styles from './ResourceGrid.module.css';

export default function ResourceGrid({ resources }) {
  return (
    <ul className={styles.grid}>
      {resources.map((resource) => (
        <li key={resource.id}>
          <ResourceCard resource={resource} />
        </li>
      ))}
    </ul>
  );
}
