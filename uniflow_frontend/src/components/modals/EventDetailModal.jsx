import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { 
  closeEventDetailModal, 
  openEditEventModal,
  openConfirmationModal,
  closeConfirmationModal,
  setConfirmationLoading 
} from '../../store/uiSlice.js';
import { setConfirmCallback } from '../../store/confirmationService.js';
import { selectIsHeadman } from '../../store/selectors/authSelector.js';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import EventTypeBadge from '../ui/EventTypeBadge.jsx';
import { useCountdown } from '../../hooks/useCountdown.js';
import { useGetEventByIdQuery, useDeleteEventMutation } from '../../store/api/eventApi.js';
import { useToggleEventSubscriptionMutation } from '../../store/api/subscriptionApi.js';
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
  ExpandableLinkValue,
  ModalSubjectText,
  ModalTitleWrapper,
  SkeletonLine,
} from './shared/ModalShared.jsx';

import CalendarIcon from '../../assets/Calendar.svg?react';
import PaperclipIcon from '../../assets/Paperclip_Attechment_Tilt.svg?react';
import LocationIcon from '../../assets/Map_Pin.svg?react';
import ExternalLinkIcon from '../../assets/External_Link.svg?react';
import FileIcon from '../../assets/File_Document.svg?react';
import EditIcon from '../../assets/Edit.svg?react';
import DeleteIcon from '../../assets/Close_MD.svg?react';

import { formatDateModal } from '../../utils/ISODateParser.js';
import { toast } from '../../utils/toast.js';

import { EventDetailSkeleton } from '../ui/skeletons/EventDetailSkeleton.jsx';

const EventDetailModal = () => {
  const dispatch = useDispatch();
  const { isOpen, eventId } = useSelector((state) => state.ui.eventDetailModal);
  const isHeadman = useSelector(selectIsHeadman);

  const { data: event, isFetching } = useGetEventByIdQuery(eventId, {
    skip: !eventId,
  });

  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();
  const [toggleSubscription] = useToggleEventSubscriptionMutation();

  const isDeadline = event?.eventType === 'Deadline';
  const timeLeft = useCountdown(isDeadline ? event?.date : null);

  const handleClose = () => dispatch(closeEventDetailModal());

  const handleToggleCalendar = async () => {
    if (!eventId) return;
    try {
      await toggleSubscription(eventId).unwrap();
      toast.success(
        event.isSubscribed ? 'Видалено з календаря' : 'Додано до календаря'
      );
    } catch {
      toast.error('Не вдалося оновити статус підписки');
    }
  };

  const handleEdit = () => {
    dispatch(openEditEventModal(eventId));
    handleClose();
  };

  const handleDelete = async () => {
    setConfirmCallback(async () => {
      try {
        dispatch(setConfirmationLoading(true));
        await deleteEvent(eventId).unwrap();
        toast.success('Подію видалено');
        dispatch(closeConfirmationModal());
        handleClose();
      } catch {
        toast.error('Не вдалося видалити подію');
      } finally {
        dispatch(setConfirmationLoading(false));
      }
    });

    dispatch(openConfirmationModal({
      title: 'Видалити подію?',
      description: 'Цю дію не можна буде скасувати.',
      confirmText: 'Так, видалити',
      cancelText: 'Скасувати'
    }));
  };

  const customTitle =
    event && !isFetching ? (
      <ModalTitleWrapper>
        <ModalSubjectText>{event.subjectName}</ModalSubjectText>
        <EventTypeBadge type={event.eventType} />
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
          <EventDetailSkeleton />
        </ModalContent>
      )}
      {!isFetching && !event && isOpen && (
        <ModalContent>
          <ModalBigTitle>Подію не знайдено</ModalBigTitle>
          <Button onClick={handleClose}>Закрити</Button>
        </ModalContent>
      )}
      {!isFetching && event && (
        <ModalContent>
          <ModalBigTitle>{event.title}</ModalBigTitle>

          {isDeadline && timeLeft && (
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
          )}

          <InfoBlock>
            <ModalDateRow>
              <CalendarIcon width={22} height={22} />
              <ModalDateText>{formatDateModal(event.date)}</ModalDateText>
            </ModalDateRow>

            {event.meetUrl && (
              <ModalLinkBox
                as="a"
                href={event.meetUrl}
                target="_blank"
                rel="noopener noreferrer"
                $clickable
              >
                <ModalLinkLeft>
                  <PaperclipIcon width={22} height={22} />
                  <ModalLinkContent>
                    <ModalLinkLabel>Посилання</ModalLinkLabel>
                    <ModalLinkValue>{event.meetUrl}</ModalLinkValue>
                  </ModalLinkContent>
                </ModalLinkLeft>
                <ExternalLinkIcon width={24} height={24} color="#6b6b6b" />
              </ModalLinkBox>
            )}

            {event.location && (
              <ModalLinkBox>
                <ModalLinkLeft>
                  <LocationIcon width={22} height={22} />
                  <ModalLinkContent>
                    <ModalLinkLabel>Локація</ModalLinkLabel>
                    <ModalLinkValue>{event.location}</ModalLinkValue>
                  </ModalLinkContent>
                </ModalLinkLeft>
              </ModalLinkBox>
            )}
            {event.description && (
              <ModalLinkBox $alignTop>
                <ModalLinkLeft $alignTop>
                  <FileIcon width={22} height={22} />
                  <ModalLinkContent>
                    <ModalLinkLabel>Деталі</ModalLinkLabel>
                    <ExpandableLinkValue text={event.description} />
                  </ModalLinkContent>
                </ModalLinkLeft>
              </ModalLinkBox>
            )}
          </InfoBlock>
          <AddToCalendarButton
            type="event"
            isSubscribed={event.isSubscribed}
            onToggle={handleToggleCalendar}
          />

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

export default EventDetailModal;
