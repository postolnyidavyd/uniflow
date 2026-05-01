import {
  Navigate,
  Outlet,
  ScrollRestoration,
  useLocation,
} from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import { useGetMeQuery } from '../store/api/authApi.js';
import Spinner from '../components/Spinner.jsx';

function RootLayout() {
    const location = useLocation();
    const { isLoading, isError } = useGetMeQuery();

    if (isLoading) return <Spinner fullscreen />;

    if (isError)
        return <Navigate to="/landing" state={{ from: location }} replace />;

    return (
        <>
            <Sidebar />
            <ScrollRestoration />
            <Outlet />
        </>
    );
}

export default RootLayout;
