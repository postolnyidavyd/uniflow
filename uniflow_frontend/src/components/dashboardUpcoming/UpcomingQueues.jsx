import {
    UpcomingEmptyStateBlock,
    UpcomingHeader,
    UpcomingWrapper,
} from './UpcomingSharedComponents.jsx';
import ClockBig from '../../assets/ClockBig.svg?react';
import UpcomingQueueBlock from "./eventAndQueueBlock/UpcomingQueueBlock.jsx";

const UpcomingQueues = ({  queues = [] }) => {
    return (
        <UpcomingWrapper>
            <UpcomingHeader>Найближчі черги</UpcomingHeader>
            {queues.length > 0 ? (
                queues.map((queue) => (
                    <UpcomingQueueBlock
                        key={queue.id}
                        shortTitle={queue.shortTitle}
                        subjectName={queue.subjectName}
                        queueStatus={queue.queueStatus}
                        queueStartTime={queue.queueStartTime}
                        entriesCount={queue.entriesCount}
                        userPosition={queue.userPosition}
                    />
                ))
            ) : (
                <UpcomingEmptyStateBlock>
                    <ClockBig style={{ color: 'var(--gorse-100)' }} />
                    Ви не стоїте
                    в жодній черзі
                </UpcomingEmptyStateBlock>
            )}
        </UpcomingWrapper>
    );
};
export default UpcomingQueues;
