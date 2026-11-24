import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, FolderOpen } from 'lucide-react';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import ResourceGrid from '../components/ResourceGrid';
import SectionHeader from '../components/SectionHeader';
import StatsStrip from '../components/StatsStrip';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useResources } from '../hooks/useResources';
import { getCategoryCounts, getRecentResources, getStats } from '../utils/resourceStats';
import styles from './DashboardPage.module.css';

const RECENT_COUNT = 3;
const POPULAR_COUNT = 6;

export default function DashboardPage() {
  useDocumentTitle('');
  const { resources } = useResources();

  const stats = getStats(resources);
  const recent = getRecentResources(resources, RECENT_COUNT);
  const popular = getCategoryCounts(resources).slice(0, POPULAR_COUNT);

  return (
    <>
      <section className={`container ${styles.hero}`}>
        <p className={styles.eyebrow}>IAI-Togo · Programming Club</p>
        <h1 className={styles.title}>
          Discover. Learn. <span className={styles.accent}>Build.</span>
        </h1>
        <p className={styles.lead}>
          DevResources is a student-built directory of the tools, languages and learning material
          that help us become better developers. Every entry is added by a member of our community.
        </p>
        <div className={styles.actions}>
          <Button as={Link} to="/resources" icon={<ArrowRight size={16} aria-hidden="true" />}>
            Browse resources
          </Button>
          <Button as={Link} to="/contributors" variant="secondary">
            Meet the contributors
          </Button>
        </div>
      </section>

      <section className="container" aria-label="Statistics">
        <StatsStrip
          items={[
            { label: 'Resources', value: stats.totalResources, to: '/resources' },
            { label: 'Categories', value: stats.totalCategories, hint: 'in use' },
            { label: 'Contributors', value: stats.totalContributors, to: '/contributors' },
            { label: 'ASR resources', value: stats.byTrack.ASR, to: '/resources?track=ASR' },
            { label: 'GLSI resources', value: stats.byTrack.GLSI, to: '/resources?track=GLSI' },
          ]}
        />
      </section>

      <section className={`container ${styles.section}`}>
        <SectionHeader
          title="Recently added"
          description="The latest contributions from the community."
          action={
            resources.length > 0 && (
              <Button
                as={Link}
                to="/resources"
                variant="ghost"
                size="sm"
                icon={<ArrowRight size={14} aria-hidden="true" />}
              >
                View all
              </Button>
            )
          }
        />
        {recent.length > 0 ? (
          <ResourceGrid resources={recent} />
        ) : (
          <EmptyState
            icon={<FolderOpen size={22} aria-hidden="true" />}
            title="No resources yet"
          >
            Add a JSON file to <code>src/data/resources/</code> and it will appear here.
          </EmptyState>
        )}
      </section>

      {popular.length > 0 && (
        <section className={`container ${styles.section}`}>
          <SectionHeader
            title="Popular categories"
            description="Where the community has shared the most."
          />
          <ul className={styles.categories}>
            {popular.map(({ name, count }, index) => (
              <li key={name}>
                <Link to={`/resources?category=${encodeURIComponent(name)}`} className={styles.category}>
                  <span className={styles.rank} aria-hidden="true">
                    {index + 1}
                  </span>
                  <span className={styles.categoryName}>{name}</span>
                  <span className={styles.categoryCount}>
                    {count} {count === 1 ? 'resource' : 'resources'}
                  </span>
                  <ChevronRight size={16} className={styles.chevron} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
