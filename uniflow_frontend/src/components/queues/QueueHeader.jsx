import styled from 'styled-components';
import BackButton from '../ui/BackButton.jsx';
import QueueSubscriptionButton from './QueueSubscriptionButton.jsx';
import ClockIcon from '../../assets/ClockBig.svg?react';
import LocationIcon from '../../assets/Map_Pin.svg?react';
import AttachmentIcon from '../../assets/Paperclip_Attechment_TiltBig.svg?react';
import { formatDateModal } from '../../utils/ISODateParser.js';
import QueueStatusBadge from '../ui/QueueStatusBadge.jsx';

const QueueHeader = ({
  sessionId,
  isSubscribed,
  title,
  subjectName,
  queueStartTime,
  location,
  meetUrl,
  queueStatus,
}) => {
  return (
    <>
      <TopNav>
        <BackButton to="/queues" label="До черг" />
        <QueueSubscriptionButton
          sessionId={sessionId}
          isSubscribed={isSubscribed}
          sessionTitle={title}
          size="sm"
        />
      </TopNav>
      <HeaderWrapper>
        <HeaderLeft>
          <h1>{subjectName}</h1>
          <h2>{title}</h2>

          <InfoRow>
            <ClockIcon />
            <span>{formatDateModal(queueStartTime)}</span>
          </InfoRow>
          {location && (
            <InfoRow>
              <LocationIcon />
              <span>{location}</span>
            </InfoRow>
          )}

          {meetUrl && (
            <InfoRow>
              <AttachmentIcon />
              <a href={meetUrl} target="_blank" rel="noopener noreferrer">
                Посилання на зустріч
              </a>
            </InfoRow>
          )}
        </HeaderLeft>

        <HeaderRight>
          <QueueStatusBadge status={queueStatus} size="lg" />
        </HeaderRight>
      </HeaderWrapper>
    </>
  );
};

const TopNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;

  h1 {
    font-size: var(--desktop-headings-h2);
    font-weight: 400;
    line-height: 2.5rem;
    letter-spacing: -0.05rem;
    margin: 0;
  }

  h2 {
    font-size: var(--desktop-headings-h3);
    font-weight: 400;
    line-height: 2rem;
    letter-spacing: -0.035rem;
    color: var(--base-black);
    margin: 0;
  }
`;

const HeaderRight = styled.div`
  flex-shrink: 0;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: var(--desktop-headings-h5);
  font-weight: 400;
  line-height: 1.5rem;
  letter-spacing: -0.025rem;
  color: var(--base-black);

  margin-left: 1rem;
  svg {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }

  a {
    color: var(--radiance-100);
    text-decoration: underline;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export default QueueHeader;
