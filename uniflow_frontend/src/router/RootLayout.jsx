import { useSelector } from 'react-redux';
import {
  Navigate,
  Outlet,
  ScrollRestoration,
  useLocation,
} from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';

function RootLayout() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated)
    return <Navigate to="/landing" state={{ from: location }} replace />;

  return (
    <>
      <Sidebar />
      <ScrollRestoration />
      {/*<ModalRoot/>*/}
      <Outlet />
    </>
  );
}
export default RootLayout;