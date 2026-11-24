import styles from './EmptyState.module.css';

export default function EmptyState({ icon, title, children, action }) {
  return (
    <div className={styles.empty} role="status">
      {icon && <div className={styles.icon}>{icon}</div>}
      <h2 className={styles.title}>{title}</h2>
      {children && <div className={styles.text}>{children}</div>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
