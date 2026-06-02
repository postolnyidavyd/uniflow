import { useGetQueueEntriesQuery } from '../../store/api/queueApi.js';
import JoinQueueForm from './JoinQueueForm.jsx';
import UserStatusCard from './UserStatusCard.jsx';
import QueueEntriesList from './QueueEntriesList.jsx';

const QueueMainSection = ({ sessionId, session }) => {
  const { data: entriesData, isLoading: isEntriesLoading } =
    useGetQueueEntriesQuery(sessionId);

  const isActive = session.queueStatus === 'Active';
  const isRegistration = session.queueStatus === 'Registration';

  const userEntry = entriesData?.userEntry;
  const entries = entriesData?.entries || [];

  const userPosition = userEntry
    ? entries.findIndex((e) => e.id === userEntry.id) + 1
    : null;

  const canJoin = (isRegistration || isActive) && !userEntry;

  return (
    <>
      {canJoin && (
        <JoinQueueForm
          sessionId={sessionId}
          submissionMode={session.submissionMode}
          isAllowedToSubmitMoreThanOne={session.isAllowedToSubmitMoreThanOne}
        />
      )}

      {(isRegistration || isActive) && userEntry && (
        <UserStatusCard
          sessionId={sessionId}
          entry={userEntry}
          queueStatus={session.queueStatus}
          position={userPosition}
        />
      )}

      {(isRegistration || isActive) && (
        <QueueEntriesList
          entries={entries}
          userEntry={userEntry}
          isEntriesLoading={isEntriesLoading}
          session={session}
        />
      )}
    </>
  );
};

export default QueueMainSection;
