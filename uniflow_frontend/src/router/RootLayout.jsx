import {
  Navigate,
  Outlet,
  ScrollRestoration,
  useLocation,
} from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import { useGetMeQuery } from '../store/api/authApi.js';
import Spinner from '../components/ui/Spinner.jsx';
import styled from "styled-components";

function RootLayout() {
    const location = useLocation();
    const { isLoading, isError } = useGetMeQuery();

    if (isLoading) return <Spinner fullscreen />;

    if (isError)
        return <Navigate to="/landing" state={{ from: location }} replace />;

    return (
        <LayoutContainer>
            <Sidebar />
                <ScrollRestoration />
                <Outlet />
        </LayoutContainer>
    );
}
const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
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
