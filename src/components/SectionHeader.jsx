import styles from './SectionHeader.module.css';

export default function SectionHeader({ title, description, action, as: Heading = 'h2' }) {
  return (
    <div className={styles.header}>
      <div>
        <Heading className={styles.title}>{title}</Heading>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {action}
    </div>
  );
}
