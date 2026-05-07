import styled from 'styled-components';
import DashboardPanelUpcoming from '../components/dashboardUpcoming/DashboardPanelUpcoming.jsx';

function DashboardPage() {
  return (
    <PageWrapper>
      DashboardPage <DashboardPanelUpcoming />
    </PageWrapper>
  );
}
const PageWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
  padding: 0.25rem 0.5rem;
  gap: 0.5rem;
`;
export default DashboardPage;
