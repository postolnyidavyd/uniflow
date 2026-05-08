// orientation: 'horizontal' | 'vertical'
import {
    useGetUpcomingBySubjectQuery,
  useGetUpcomingQuery,
} from '../../store/api/calendarApi.js';
import styled from 'styled-components';
import UpcomingDeadlines from './UpcomingDeadlines.jsx';
import UpcomingEvents from './UpcomingEvents.jsx';
import UpcomingQueues from './UpcomingQueues.jsx';

const DashboardPanelUpcoming = ({ orientation = 'horizontal', subjectId }) => {
  const globalQuery = useGetUpcomingQuery(undefined, { skip: !!subjectId });
  const subjectQuery = useGetUpcomingBySubjectQuery(subjectId, {
    skip: !subjectId,
  });
  const { data, isLoading, error } = subjectId ? subjectQuery : globalQuery;
  return (
    <PanelContainer $orientation={orientation}>
      <UpcomingDeadlines deadlines={data?.deadlines} />
      <UpcomingQueues queues={data?.queues} />
      <UpcomingEvents events={data?.events} />
    </PanelContainer>
  );
};
const PanelContainer = styled.div`
  display: flex;
  flex-direction: ${({ $orientation }) =>
    $orientation === 'horizontal' ? 'row' : 'column'};
  align-items: ${({ $orientation }) =>
    $orientation === 'horizontal' ? 'stretch' : 'stretch'};
  gap: 0.5rem;
  width: 100%;
`;
export default DashboardPanelUpcoming;
