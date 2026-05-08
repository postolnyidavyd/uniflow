import styled from 'styled-components';
import DashboardPanelUpcoming from '../components/dashboardUpcoming/DashboardPanelUpcoming.jsx';
import CalendarSection from '../components/CalendarSection/CalendarSection.jsx';

function DashboardPage() {
  return (
    <PageWrapper>
      <CalendarSection />
      <DashboardPanelUpcoming />
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
