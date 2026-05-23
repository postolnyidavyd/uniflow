// orientation: 'horizontal' | 'vertical'
import {
  useGetUpcomingBySubjectQuery,
  useGetUpcomingQuery,
} from '../../store/api/calendarApi.js';
import styled from 'styled-components';
import UpcomingDeadlines from './UpcomingDeadlines.jsx';
import UpcomingEvents from './UpcomingEvents.jsx';
import UpcomingQueues from './UpcomingQueues.jsx';
import { UpcomingSectionSkeleton } from '../ui/skeletons/UpcomingSectionSkeleton.jsx';

const DashboardPanelUpcoming = ({ orientation = 'horizontal', subjectId }) => {
  const globalQuery = useGetUpcomingQuery(undefined, { skip: !!subjectId });
  const subjectQuery = useGetUpcomingBySubjectQuery(subjectId, {
    skip: !subjectId,
  });
  const { data, isFetching } = subjectId ? subjectQuery : globalQuery;

  if (isFetching) {
    return (
      <PanelContainer $orientation={orientation}>
        <UpcomingSectionSkeleton />
        <UpcomingSectionSkeleton />
        <UpcomingSectionSkeleton />
      </PanelContainer>
    );
  }

  return (
    <PanelContainer $orientation={orientation}>
      <UpcomingDeadlines deadlines={data?.deadlines} />
      <UpcomingQueues queues={data?.queues} isSubjectUpcoming={!!subjectId} />
      <UpcomingEvents events={data?.events} />
    </PanelContainer>
  );
};

const PanelContainer = styled.div`
  display: flex;
  flex-direction: ${({ $orientation }) =>
    $orientation === 'horizontal' ? 'row' : 'column'};
  align-items: stretch;
  gap: 0.5rem;

  width: ${({ $orientation }) =>
    $orientation === 'horizontal' ? '100%' : '22rem'};
`;
export default DashboardPanelUpcoming;
