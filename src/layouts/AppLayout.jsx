import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DataIssues from '../components/DataIssues';
import { useResources } from '../hooks/useResources';
import styles from './AppLayout.module.css';

export default function AppLayout() {
  const { pathname } = useLocation();
  const { issues } = useResources();

  // Start each page at the top when navigating.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={styles.shell}>
      <a href="#main" className={styles.skip}>
        Skip to content
      </a>
      <Header />
      <DataIssues issues={issues} />
      {/* Changing `key` replays the subtle page-in animation on navigation. */}
      <main id="main" className={styles.main} key={pathname} tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
