import styled from 'styled-components';
import QueueStatusBadge from '../ui/QueueStatusBadge.jsx';
import Button from '../ui/Button.jsx';
import ClockIcon from '../../assets/ClockSmall.svg?react';
import LocationIcon from '../../assets/Map_Pin.svg?react';
import UserIcon from '../../assets/UsersSmall.svg?react';
import ExternalLinkIcon from '../../assets/External_Link.svg?react';
import { formatDateModal } from '../../utils/ISODateParser.js';
import { useNavigate } from 'react-router-dom';

const QueueCard = ({
  id,
  shortTitle,
  subjectName,
  queueStatus,
  queueStartTime,
  registrationStartTime,
  location,
  meetUrl,
  entriesCount,
  guaranteedSlots,
  isUserJoined,
  currentStudentName,
}) => {
  const navigate = useNavigate();

  const isActive = queueStatus === 'Registration' || queueStatus === 'Active';
  const isPlanned = queueStatus === 'Planned';

  const handleClick = () => navigate(`/queues/${id}`);

  const handleLinkClick = (e) => e.stopPropagation();

  return (
    <Card onClick={handleClick} $isUserJoined={isUserJoined}>
      <TopSection>
        <QueueStatusBadge
          status={queueStatus}
          size="sm"
          style={{ justifyContent: 'flex-start' }}
        />

        {isPlanned && (
          <RegistrationInfo>
            Початок запису: {formatDateModal(registrationStartTime)}
          </RegistrationInfo>
        )}
      </TopSection>

      <Title>
        {subjectName} — {shortTitle}
      </Title>

      <InfoRows>
        {queueStatus === 'Active' && currentStudentName ? (
          <InfoRow>
            <UserIcon width={20} height={20} />
            <InfoText>Зараз: {currentStudentName}</InfoText>
          </InfoRow>
        ) : (
          <InfoRow>
            <ClockIcon width={20} height={20} />
            <InfoText>{formatDateModal(queueStartTime)}</InfoText>
          </InfoRow>
        )}

        {meetUrl ? (
          <InfoRow>
            <ExternalLinkIcon width={20} height={20} />
            <LinkText
              href={meetUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
            >
              {meetUrl}
            </LinkText>
          </InfoRow>
        ) : location ? (
          <InfoRow>
            <LocationIcon width={20} height={20} />
            <InfoText>{location}</InfoText>
          </InfoRow>
        ) : null}
      </InfoRows>

      <BottomRow>
        {isActive && (
          <SlotsText $over={entriesCount > guaranteedSlots}>
            {entriesCount}/{guaranteedSlots}
          </SlotsText>
        )}

        {isActive && (
          <Button
            variant={isUserJoined ? 'secondary' : 'primary'}
            size="sm"
            onClick={handleClick}
          >
            {isUserJoined ? 'Ви записані' : 'Записатися'}
          </Button>
        )}
      </BottomRow>
    </Card>
  );
};

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 1.25rem;
  border: 1.901px solid
    ${({ $isUserJoined }) =>
      $isUserJoined
        ? 'var(--accent-color)'
        : 'var(--base-bright-grey, #e7eef3)'};
  background: ${({ $isUserJoined }) =>
    $isUserJoined
      ? 'color-mix(in srgb, var(--accent-color) 4%, transparent)'
      : 'var(--base-white)'};
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.15s ease;

  &:hover {
    border-color: ${({ $isUserJoined }) =>
      $isUserJoined ? 'var(--accent-color)' : 'var(--grey-40)'};
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-height: 2.75rem;
`;

const RegistrationInfo = styled.span`
  color: var(--base-black, #000);
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1rem;
  letter-spacing: -0.015rem;
`;

const Title = styled.h3`
  font-size: var(--desktop-headings-h5);
  font-weight: 400;
  line-height: 1.5rem; /* 24px */
  letter-spacing: -0.025rem;
  color: var(--base-black);
  /* Рівно 2 рядки */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 3rem;
  margin: 0;
`;
const InfoRows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  min-width: 0;

  svg {
    flex-shrink: 0;
  }
`;

const InfoText = styled.span`
  font-size: var(--desktop-headings-h7);
  font-weight: 400;
  line-height: 1.5rem;
  letter-spacing: -0.02rem;
  color: var(--base-black);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`;

const LinkText = styled.a`
  font-size: var(--desktop-headings-h7);
  font-weight: 400;
  line-height: 1.5rem;
  letter-spacing: -0.02rem;
  color: var(--radiance-100, #007eff);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  transition: color 0.15s ease;

  &:hover {
    color: var(--radiance-80);
  }
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

const SlotsText = styled.span`
  font-size: var(--desktop-headings-h4);
  font-weight: 400;
  line-height: 1.75rem; /* 28px */
  letter-spacing: -0.03rem;
  color: ${({ $over }) =>
    $over ? 'var(--brick-red-100)' : 'var(--base-black)'};
`;

export default QueueCard;
