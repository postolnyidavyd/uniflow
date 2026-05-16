import{ useMemo } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  closeQueueDetailModal,
} from '../../store/uiSlice.js';
import {
  selectQueueDetailModalIsOpen,
  selectQueueDetailSessionId,
} from '../../store/selectors/uiSelector.js';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import EventTypeBadge from '../ui/EventTypeBadge.jsx';
import { useCountdown } from '../../hooks/useCountdown.js';
import {
  useGetQueueByIdQuery,
  useGetQueueEntriesQuery,
} from '../../store/api/queueApi.js';
import { useToggleQueueSubscriptionMutation } from '../../store/api/subscriptionApi.js';
import {
  queueStatusFormating,
  colorStatusFormating,
} from '../../utils/queueStatusFormating.js';
import {
  AddToCalendarButton,
  CountdownSeparator,
  ModalBigTitle,
  ModalContent,
  ModalCountdown,
  ModalDateRow,
  ModalDateText,
  ModalSubjectText,
  ModalTitleWrapper,
  SkeletonLine,
} from './shared/ModalShared.jsx';

import CalendarIcon from '../../assets/Calendar.svg?react';
import PeopleIcon from '../../assets/UsersSmall.svg?react';
import ClockIcon from '../../assets/ClockSmall.svg?react';

import {
  formatDateModal,
  formatShortTime,
} from '../../utils/ISODateParser.js';

const PLANNED = 'Planned';
const REGISTRATION = 'Registration';
const ACTIVE = 'Active';
const CLOSED = 'Closed';
const CANCELLED = 'Cancelled';

const QueueDetailModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isOpen = useSelector(selectQueueDetailModalIsOpen);
  const sessionId = useSelector(selectQueueDetailSessionId);

  const { data: session, isLoading } = useGetQueueByIdQuery(sessionId, {
    skip: !sessionId,
  });

  const isActive =
    session?.queueStatus === REGISTRATION || session?.queueStatus === ACTIVE;

  const { data: queueState } = useGetQueueEntriesQuery(sessionId, {
    skip: !sessionId || !isActive,
    pollingInterval: isActive ? 10000 : 0,
  });

  const [toggleSubscription] = useToggleQueueSubscriptionMutation();

  const { entries = [], userEntry = null } = queueState || {};

  const userPosition = useMemo(() => {
    if (!userEntry || !entries.length) return null;
    return entries.findIndex((e) => e.id === userEntry.id) + 1;
  }, [userEntry, entries]);

  const isUserInQueue = !!userEntry;
  const isUserInProgress = userEntry?.entryStatus === 'InProgress';
  const queueEntriesCount = entries.length;

  const timeLeft = useCountdown(
    session?.queueStatus === PLANNED ? session.registrationStartTime : null
  );

  const estimatedTime = useMemo(() => {
    if (!userPosition || !session?.averageMinutesPerStudent) return null;
    const millisecondsToAdd =
      (userPosition - 1) * session.averageMinutesPerStudent * 60 * 1000;
    return Date.now() + millisecondsToAdd;
  }, [userPosition, session?.averageMinutesPerStudent]);

  const handleClose = () => dispatch(closeQueueDetailModal());

  const handleToggleCalendar = async () => {
    if (!sessionId) return;
    try {
      await toggleSubscription(sessionId).unwrap();
    } catch {}
  };

  const handleNavigate = () => {
    handleClose();
    navigate(`/queues/${sessionId}`);
  };

  const statusLabel = session
    ? queueStatusFormating[session.queueStatus]
    : null;
  const statusColor = session
    ? colorStatusFormating[session.queueStatus]
    : null;
  const hasDot = isActive;

  const customTitle = session ? (
    <ModalTitleWrapper>
      <ModalSubjectText>{session.subjectName}</ModalSubjectText>
      <EventTypeBadge type="Queue" />
    </ModalTitleWrapper>
  ) : null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={customTitle}>
      {isLoading && <SkeletonLine $height="40px" />}
      {!isLoading && !session && isOpen && (
          <ModalContent>
              <ModalBigTitle>Чергу не знайдено</ModalBigTitle>
              <Button onClick={handleClose}>Закрити</Button>
          </ModalContent>
      )}
      {!isLoading && session && (
        <ModalContent>
          <ModalBigTitle>{session.title}</ModalBigTitle>

          <ModalDateRow>
            <CalendarIcon width={22} height={22} />
            <ModalDateText>{formatDateModal(session.queueStartTime)}</ModalDateText>
            <StatusBadge $color={statusColor}>
              {hasDot && <StatusDot $color={statusColor} />}
              {statusLabel}
            </StatusBadge>
          </ModalDateRow>

          {session.queueStatus === PLANNED && (
            <CountdownSection>
              <CountdownLabel>Початок запису</CountdownLabel>
              {timeLeft ? (
                <ModalCountdown>
                  <span>{timeLeft.hours}</span>
                  <CountdownSeparator>:</CountdownSeparator>
                  <span>{timeLeft.minutes}</span>
                  <CountdownSeparator>:</CountdownSeparator>
                  <span>{timeLeft.seconds}</span>
                </ModalCountdown>
              ) : (
                <ModalCountdown>—</ModalCountdown>
              )}
              <RegistrationDateRow>
                <CalendarIcon width={18} height={18} />
                <ModalDateText
                  style={{
                    fontSize: '1rem',
                    color: 'var(--base-secondary-text)',
                  }}
                >
                  {formatDateModal(session.registrationStartTime)}
                </ModalDateText>
              </RegistrationDateRow>
            </CountdownSection>
          )}

          {isActive && (
            <>
              {isUserInQueue && (
                <PositionSection>
                  <PositionLabel>Ваша позиція</PositionLabel>
                  <PositionNumber>{userPosition}</PositionNumber>

                  {session.queueStatus === ACTIVE &&
                    isUserInProgress &&
                    estimatedTime && (
                      <EstimatedRow>
                        <ClockIcon width={18} height={18} />
                        <ModalDateText>
                          Приблизний час здачі: {formatShortTime(estimatedTime)}
                        </ModalDateText>
                      </EstimatedRow>
                    )}
                </PositionSection>
              )}
              <PeopleRow>
                <PeopleIcon width={20} height={20} />
                <ModalDateText>
                  Людей в черзі: {queueEntriesCount}
                </ModalDateText>
              </PeopleRow>
            </>
          )}

          {(session.queueStatus === CLOSED ||
            session.queueStatus === CANCELLED) && (
            <ClosedText>
              {session.queueStatus === CANCELLED
                ? 'Чергу скасовано'
                : 'Чергу завершено'}
            </ClosedText>
          )}

          {isActive && (
            <Button variant="primary" fullWidth onClick={handleNavigate}>
              {isUserInQueue ? 'Перейти на сторінку черги' : 'Записатися'}
            </Button>
          )}

          {session.queueStatus !== CLOSED &&
            session.queueStatus !== CANCELLED && (
              <AddToCalendarButton
                type="queue"
                isSubscribed={session.isSubscribed ?? false}
                onToggle={handleToggleCalendar}
                isUserInQueue={isUserInQueue}
              />
            )}
        </ModalContent>
      )}
    </Modal>
  );
};

const StatusBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-family: 'e-Ukraine', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: ${({ $color }) => $color};
  margin-left: auto;
`;

const StatusDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const CountdownSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const CountdownLabel = styled.span`
  font-family: 'e-Ukraine', sans-serif;
  font-size: 1.25rem;
  font-weight: 400;
  color: var(--base-secondary-text, #6b6b6b);
`;

const RegistrationDateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PositionSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

const PositionLabel = styled.span`
  font-family: 'e-Ukraine', sans-serif;
  font-size: 1.25rem;
  font-weight: 400;
  color: var(--base-secondary-text, #6b6b6b);
`;

const PositionNumber = styled.span`
  font-family: 'e-Ukraine', sans-serif;
  font-size: 5rem;
  font-weight: 400;
  line-height: 1;
  color: var(--base-black, #000000);
`;

const EstimatedRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--base-secondary-text, #6b6b6b);
  margin-top: 0.5rem;
`;

const PeopleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--base-secondary-text, #6b6b6b);
`;

const ClosedText = styled.p`
  text-align: center;
  font-family: 'e-Ukraine', sans-serif;
  font-size: 1.25rem;
  color: var(--base-secondary-text, #6b6b6b);
  margin: 0;
`;

export default QueueDetailModal;
