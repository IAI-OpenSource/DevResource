import { Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import ContributorsPage from './pages/ContributorsPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import ResourceDetailPage from './pages/ResourceDetailPage';
import ResourcesPage from './pages/ResourcesPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="resources/:id" element={<ResourceDetailPage />} />
        <Route path="contributors" element={<ContributorsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
