import RootLayout from './RootLayout.jsx';
import ErrorPage from './ErrorPage.jsx';
import LandingPage from '../pages/LandingPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import SubjectsPage from '../pages/SubjectsPage.jsx';
import SubjectDetailPage from '../pages/SubjectDetailPage.jsx';
import QueuesPage from '../pages/QueuesPage.jsx';
import QueueDetailPage from '../pages/QueueDetailPage.jsx';
import SettingsPage from '../pages/SettingsPage.jsx';

export const routesConfig = [
  // Публічні роути — без Sidebar
  {
    path: '/landing',
    element: <LandingPage />,
  },
  // Захищені роути — з Sidebar
  {
    element: <RootLayout />,
    errorElement: <ErrorPage />,

    path: '/',
    children: [
      { index: true, element: <DashboardPage /> },
      { path: '/subjects', element: <SubjectsPage /> },
      { path: '/subjects/:subjectId', element: <SubjectDetailPage /> },
      { path: '/queues', element: <QueuesPage /> },
      { path: '/queues/:sessionId', element: <QueueDetailPage /> },
      // { path: '/profile', element: <ProfilePage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },
];
