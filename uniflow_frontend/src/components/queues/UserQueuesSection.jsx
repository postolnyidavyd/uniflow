import styled from 'styled-components';
import { useGetMyActiveQueuesQuery } from '../../store/api/queueApi.js';
import MyQueueCard from './MyQueueCard.jsx';
import { MyQueueCardSkeleton } from '../ui/skeletons/MyQueueCardSkeleton.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import CoffeeIcon from '../../assets/CoffeeBig.svg?react';

const UserQueuesSection = () => {
  const { data: queues, isFetching } = useGetMyActiveQueuesQuery();
  
  if (isFetching) {
    return (
      <CenteredContainer>
        <MyQueueCardSkeleton />
        <MyQueueCardSkeleton />
      </CenteredContainer>
    );
  }

  if (!queues || queues.length === 0) {
    return (
      <CenteredContainer>
        <EmptyState
          variant="large"
          icon={CoffeeIcon}
          title="Ви вільні !"
          description="Наразі ви не стоїте в жодній черзі. Можете піти випити кави або приєднатися до однієї з доступних черг."
        />
      </CenteredContainer>
    );
  }

  return (
    <CenteredContainer>
      {queues.map((q) => (
        <MyQueueCard
          key={q.id}
          id={q.id}
          shortTitle={q.shortTitle}
          subjectName={q.subjectName}
          queueStartTime={q.queueStartTime}
          location={q.location}
          meetUrl={q.meetUrl}
          userPosition={q.userPosition}
          isGuaranteed={q.isGuaranteed}
          currentStudentName={q.currentStudentName}
          estimatedWaitMinutes={q.estimatedWaitMinutes}
          queueStatus={q.queueStatus}
          usedToken={q.usedToken}
        />
      ))}
    </CenteredContainer>
  );
};

const CenteredContainer = styled.div`
  width: 100%;
  max-width: 950px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export default UserQueuesSection;
