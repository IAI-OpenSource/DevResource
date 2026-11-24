import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p>
          <strong>DevResources</strong> — built by students of IAI-Togo.
        </p>
        <p>Maintained by the IAI Programming Club.</p>
      </div>
    </footer>
  );
}
