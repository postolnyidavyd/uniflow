import {
  UpcomingEmptyStateBlock,
  UpcomingHeader,
  UpcomingWrapper,
} from './UpcomingSharedComponents.jsx';
import UsersBig from '../../assets/UsersBig.svg?react';
import UpcomingEventBlock from './eventAndQueueBlock/UpcomingEventBlock.jsx';

const UpcomingDeadlines = ({ deadlines = [] }) => {
  return (
    <UpcomingWrapper>
      <UpcomingHeader>Найближчі дедлайни</UpcomingHeader>
      {deadlines.length > 0 ? (
        deadlines.map((deadline, index) => (
          <UpcomingEventBlock
            key={deadline.id}
            id={deadline.id}
            focus={index === 0}
            date={deadline.date}
            shortTitle={deadline.shortTitle}
            subjectName={deadline.subjectName}
            eventType={deadline.eventType}
          />
        ))
      ) : (
        <UpcomingEmptyStateBlock>
          <UsersBig style={{ color: 'var(--brick-red-100)' }} />
          Немає дедлайнів
        </UpcomingEmptyStateBlock>
      )}
    </UpcomingWrapper>
  );
};

export default UpcomingDeadlines;
