import {
    UpcomingEmptyStateBlock,
    UpcomingHeader,
    UpcomingWrapper,
} from './UpcomingSharedComponents.jsx';
import CalendarEventBig from '../../assets/Calendar_EventBig.svg?react';
import UpcomingEventBlock from './eventAndQueueBlock/UpcomingEventBlock.jsx';

const UpcomingEvents = ({ events = [] }) => {
    return (
        <UpcomingWrapper>
            <UpcomingHeader>Найближчі події</UpcomingHeader>
            {events.length > 0 ? (
                events.map((event) => (
                    <UpcomingEventBlock
                        key={event.id}
                        id={event.id}
                        date={event.date}
                        shortTitle={event.shortTitle}
                        subjectName={event.subjectName}
                        eventType={event.eventType}
                    />
                ))
            ) : (
                <UpcomingEmptyStateBlock>
                    <CalendarEventBig style={{ color: 'var(--radiance-100)' }} />
                    Немає подій
                </UpcomingEmptyStateBlock>
            )}
        </UpcomingWrapper>
    );
};

export default UpcomingEvents;
