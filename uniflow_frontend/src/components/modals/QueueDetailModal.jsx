import { useMemo } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  closeQueueDetailModal, 
  openEditQueueModal,
  openConfirmationModal,
  closeConfirmationModal,
  setConfirmationLoading
} from '../../store/uiSlice.js';
import { setConfirmCallback } from '../../store/confirmationService.js';
import {
  selectQueueDetailModalIsOpen,
  selectQueueDetailSessionId,
} from '../../store/selectors/uiSelector.js';
import { selectIsHeadman } from '../../store/selectors/authSelector.js';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import EventTypeBadge from '../ui/EventTypeBadge.jsx';
import { useCountdown } from '../../hooks/useCountdown.js';
import {
  useGetQueueByIdQuery,
  useGetQueueEntriesQuery,
  useDeleteQueueMutation,
} from '../../store/api/queueApi.js';
import { useToggleQueueSubscriptionMutation } from '../../store/api/subscriptionApi.js';
import SectionSeparator from '../ui/SectionSeparator.jsx';

import {
  AddToCalendarButton,
  CountdownSeparator,
  CountdownSegment,
  CountdownLabel,
  ModalBigTitle,
  ModalContent,
  ModalCountdown,
  ModalDateRow,
  ModalDateText,
  ModalLinkBox,
  ModalLinkContent,
  ModalLinkLeft,
  ModalLinkLabel,
  ModalLinkValue,
  ModalSubjectText,
  ModalTitleWrapper,
  SkeletonLine,
} from './shared/ModalShared.jsx';

import CalendarIcon from '../../assets/Calendar.svg?react';
import PeopleIcon from '../../assets/UsersSmall.svg?react';
import ClockIcon from '../../assets/ClockSmall.svg?react';
import EditIcon from '../../assets/Edit.svg?react';
import DeleteIcon from '../../assets/Close_MD.svg?react';
import LocationIcon from '../../assets/Map_Pin.svg?react';
import PaperclipIcon from '../../assets/Paperclip_Attechment_Tilt.svg?react';
import ExternalLinkIcon from '../../assets/External_Link.svg?react';

import { formatDateModal, formatShortTime } from '../../utils/ISODateParser.js';
import { toast } from '../../utils/toast.js';
import QueueStatusBadge from '../ui/QueueStatusBadge.jsx';

import { QueueDetailSkeleton } from '../ui/skeletons/QueueDetailSkeleton.jsx';

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
  const isHeadman = useSelector(selectIsHeadman);

  const { data: session, isFetching } = useGetQueueByIdQuery(sessionId, {
    skip: !sessionId,
  });

  const [deleteQueue, { isLoading: isDeleting }] = useDeleteQueueMutation();

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
      toast.success(
        session.isSubscribed ? 'Видалено з календаря' : 'Додано до календаря'
      );
    } catch {
      toast.error('Не вдалося оновити статус підписки');
    }
  };

  const handleNavigate = () => {
    handleClose();
    navigate(`/queues/${sessionId}`);
  };

  const handleEdit = () => {
    dispatch(openEditQueueModal(sessionId));
    handleClose();
  };

  const handleDelete = () => {
    setConfirmCallback(async () => {
      try {
        dispatch(setConfirmationLoading(true));
        await deleteQueue(sessionId).unwrap();
        toast.success('Чергу видалено');
        dispatch(closeConfirmationModal());
        handleClose();
      } catch {
        toast.error('Не вдалося видалити чергу');
      } finally {
        dispatch(setConfirmationLoading(false));
      }
    });

    dispatch(openConfirmationModal({
      title: 'Видалити чергу?',
      description: 'Усі записи та дані цієї черги будуть видалені назавжди. Студентам, що використали токени, вони будуть повернуті.',
      confirmText: 'Так, видалити',
      cancelText: 'Скасувати'
    }));
  };

  const customTitle =
    session && !isFetching ? (
      <ModalTitleWrapper>
        <ModalSubjectText>{session.subjectName}</ModalSubjectText>
        <EventTypeBadge type="Queue" />
      </ModalTitleWrapper>
    ) : isFetching ? (
      <ModalTitleWrapper>
        <SkeletonLine $width="14rem" $height="1.25rem" />
        <SkeletonLine $width="4rem" $height="1.5rem" $borderRadius="2rem" />
      </ModalTitleWrapper>
    ) : null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={customTitle}>
      {isFetching && (
        <ModalContent>
          <QueueDetailSkeleton />
        </ModalContent>
      )}
      {!isFetching && !session && isOpen && (
        <ModalContent>
          <ModalBigTitle>Чергу не знайдено</ModalBigTitle>
          <Button onClick={handleClose}>Закрити</Button>
        </ModalContent>
      )}
      {!isFetching && session && (
        <ModalContent>
          <ModalBigTitle>{session.title}</ModalBigTitle>
          <InfoBlock>
            <HeaderRow>
              <ModalDateRow>
                <CalendarIcon width={22} height={22} />
                <ModalDateText>
                  {formatDateModal(session.queueStartTime)}
                </ModalDateText>
              </ModalDateRow>
              <QueueStatusBadge status={session.queueStatus} />
            </HeaderRow>

            {session.meetUrl && (
              <ModalLinkBox
                as="a"
                href={session.meetUrl}
                target="_blank"
                rel="noopener noreferrer"
                $clickable
              >
                <ModalLinkLeft>
                  <PaperclipIcon width={22} height={22} />
                  <ModalLinkContent>
                    <ModalLinkLabel>Посилання</ModalLinkLabel>
                    <ModalLinkValue>{session.meetUrl}</ModalLinkValue>
                  </ModalLinkContent>
                </ModalLinkLeft>
                <ExternalLinkIcon width={24} height={24} color="#6b6b6b" />
              </ModalLinkBox>
            )}

            {session.location && (
              <ModalLinkBox>
                <ModalLinkLeft>
                  <LocationIcon width={22} height={22} />
                  <ModalLinkContent>
                    <ModalLinkLabel>Локація</ModalLinkLabel>
                    <ModalLinkValue>{session.location}</ModalLinkValue>
                  </ModalLinkContent>
                </ModalLinkLeft>
              </ModalLinkBox>
            )}
          </InfoBlock>

          {session.queueStatus === PLANNED && (
            <CountdownSection>
              <CountdownLabelHeader>Початок запису</CountdownLabelHeader>
              {timeLeft ? (
                <ModalCountdown>
                  {timeLeft.days ? (
                    <>
                      <CountdownSegment>
                        <span>{timeLeft.days}</span>
                        <CountdownLabel>дн</CountdownLabel>
                      </CountdownSegment>
                      <CountdownSeparator>:</CountdownSeparator>
                      <CountdownSegment>
                        <span>{timeLeft.hours}</span>
                        <CountdownLabel>год</CountdownLabel>
                      </CountdownSegment>
                      <CountdownSeparator>:</CountdownSeparator>
                      <CountdownSegment>
                        <span>{timeLeft.minutes}</span>
                        <CountdownLabel>хв</CountdownLabel>
                      </CountdownSegment>
                    </>
                  ) : (
                    <>
                      <span>{timeLeft.hours}</span>
                      <CountdownSeparator>:</CountdownSeparator>
                      <span>{timeLeft.minutes}</span>
                      <CountdownSeparator>:</CountdownSeparator>
                      <span>{timeLeft.seconds}</span>
                    </>
                  )}
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
          <ButtonGroup>
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
          </ButtonGroup>

          {isHeadman && (
            <HeadmanSection>
              <SectionSeparator size="sm" />
              <HeadmanActions>
                <Button 
                  variant="secondary" 
                  fullWidth 
                  onClick={handleEdit}
                  disabled={isDeleting}
                >
                  <EditIcon width={24} height={24} />
                  Редагувати
                </Button>
                <Button 
                  variant="secondary" 
                  fullWidth 
                  onClick={handleDelete}
                  isLoading={isDeleting}
                  disabled={isDeleting}
                >
                  <DeleteIcon width={24} height={24} />
                  Видалити
                </Button>
              </HeadmanActions>
            </HeadmanSection>
          )}
        </ModalContent>
      )}
    </Modal>
  );
};

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CountdownSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  align-self: stretch;
`;
const CountdownLabelHeader = styled.span`
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
  color: var(--base-black);
`;

const ClosedText = styled.p`
  text-align: center;
  font-family: 'e-Ukraine', sans-serif;
  font-size: 1.25rem;
  color: var(--base-secondary-text, #6b6b6b);
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-self: stretch;
`;

const HeadmanSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const HeadmanActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.625rem;
  width: 100%;
`;

export default QueueDetailModal;
