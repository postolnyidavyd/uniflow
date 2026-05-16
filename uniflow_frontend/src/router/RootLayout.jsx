import {
  Navigate,
  Outlet,
  ScrollRestoration,
  useLocation,
} from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import { useGetMeQuery } from '../store/api/authApi.js';
import Spinner from '../components/ui/Spinner.jsx';
import styled from 'styled-components';
import EventDetailModal from '../components/modals/EventDetailModal.jsx';
import { useGetCalendarSettingsQuery } from '../store/api/subscriptionApi.js';
import ModalsProvider from '../components/modals/ModalsProvider.jsx';

function RootLayout() {
  const location = useLocation();
  const { isLoading, isError } = useGetMeQuery();
  useGetCalendarSettingsQuery(); // просто додаємо в кеш поки користувача грузим

  if (isLoading) return <Spinner fullscreen />;

  if (isError)
    return <Navigate to="/landing" state={{ from: location }} replace />;

  return (
    <LayoutContainer>
      <Sidebar />
      <main>
        <ScrollRestoration />
        <Outlet />
      </main>
      <ModalsProvider />
    </LayoutContainer>
  );
}
const LayoutContainer = styled.div`
  display: grid;
  grid-template-columns: 258px 1fr;
  min-height: 100dvh;
`;
// const PageWrapper = styled.div`
//     flex: 1;
//   display: flex;
//   flex-direction: column;
//   height: 100dvh;
//   overflow: hidden;
//   padding: 0.25rem 0.5rem;
//   gap: 0.5rem;
// `;
export default RootLayout;
