import { Link, NavLink } from 'react-router-dom';
import { Layers } from 'lucide-react';
import styles from './Header.module.css';

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/resources', label: 'Resources' },
  { to: '/contributors', label: 'Contributors' },
];

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.brand}>
          <span className={styles.mark} aria-hidden="true">
            <Layers size={16} strokeWidth={2.2} />
          </span>
          DevResources
        </Link>

        <nav aria-label="Main">
          <ul className={styles.nav}>
            {links.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `${styles.link} ${isActive ? styles.active : ''}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
