import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function NotFoundPage() {
  useDocumentTitle('Page not found');
  return (
    <div className="container" style={{ paddingBlock: 'var(--space-8) 0' }}>
      <EmptyState
        icon={<Compass size={22} aria-hidden="true" />}
        title="Page not found"
        action={
          <Button as={Link} to="/">
            Back to the dashboard
          </Button>
        }
      >
        The page you are looking for doesn&apos;t exist.
      </EmptyState>
    </div>
  );
}
