import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useGetQueueByIdQuery } from '../store/api/queueApi.js';
import { QueueDetailSkeleton } from '../components/ui/skeletons/QueueDetailSkeleton.jsx';
import QueueHeader from '../components/queues/QueueHeader.jsx';
import RegistrationStartCountdown from '../components/queues/RegistrationStartCountdown.jsx';
import QueueMainSection from '../components/queues/QueueMainSection.jsx';
import useQueueHub from '../hooks/useQueueHub.jsx';

const QueueDetailPage = () => {
  const { sessionId } = useParams();
  const { data: session, isLoading: isSessionLoading } =
    useGetQueueByIdQuery(sessionId);
  useQueueHub(sessionId);

  if (isSessionLoading) {
    return (
      <PageWrapper>
        <CenteredContainer>
          <QueueDetailSkeleton />
        </CenteredContainer>
      </PageWrapper>
    );
  }

  if (!session) return <PageWrapper><div style={{ padding: '2rem' }}>Чергу не знайдено</div></PageWrapper>;

  const isPlanned = session.queueStatus === 'Planned';

  return (
    <PageWrapper>
      <CenteredContainer>
        <QueueHeader
          sessionId={sessionId}
          isSubscribed={session.isSubscribed}
          title={session.title}
          subjectName={session.subjectName}
          queueStartTime={session.queueStartTime}
          location={session.location}
          meetUrl={session.meetUrl}
          queueStatus={session.queueStatus}
        />
        {isPlanned && (
          <RegistrationStartCountdown
            registrationStartTime={session?.registrationStartTime}
          />
        )}
        <QueueMainSection sessionId={sessionId} session={session} />
      </CenteredContainer>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
  min-height: 100%;
  box-sizing: border-box;
`;

const CenteredContainer = styled.div`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export default QueueDetailPage;
