import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { closeEventDetailModal, openEditEventModal } from '../../store/uiSlice.js';
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
  ModalBigTitle,
  ModalContent,
  ModalCountdown,
  ModalDateRow,
  ModalDateText,
  ModalLinkBox,
  ModalLinkContent,
  ModalLinkHref,
  ModalLinkLabel,
  ModalLinkLeft,
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
    if (!window.confirm('Ви впевнені, що хочете видалити цю подію?')) return;
    try {
      await deleteEvent(eventId).unwrap();
      toast.success('Подію видалено');
      handleClose();
    } catch {
      toast.error('Не вдалося видалити подію');
    }
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
              <span>{timeLeft.hours}</span>
              <CountdownSeparator>:</CountdownSeparator>
              <span>{timeLeft.minutes}</span>
              <CountdownSeparator>:</CountdownSeparator>
              <span>{timeLeft.seconds}</span>
            </ModalCountdown>
          )}

          <InfoBlock>
            <ModalDateRow>
              <CalendarIcon width={22} height={22} />
              <ModalDateText>{formatDateModal(event.date)}</ModalDateText>
            </ModalDateRow>

            {event.meetUrl && (
              <ModalLinkBox>
                <ModalLinkLeft>
                  <PaperclipIcon width={22} height={22} />
                  <ModalLinkContent>
                    <ModalLinkLabel>Посилання</ModalLinkLabel>
                    <ModalLinkHref
                      href={event.meetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {event.meetUrl}
                    </ModalLinkHref>
                  </ModalLinkContent>
                </ModalLinkLeft>
                <a
                  href={event.meetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <ExternalLinkIcon width={24} height={24} />
                </a>
              </ModalLinkBox>
            )}

            {event.location && (
              <ModalLinkBox>
                <ModalLinkLeft>
                  <LocationIcon width={22} height={22} />
                  <ModalLinkContent>
                    <ModalLinkLabel>Локація</ModalLinkLabel>
                    <SecondaryText>{event.location}</SecondaryText>
                  </ModalLinkContent>
                </ModalLinkLeft>
              </ModalLinkBox>
            )}
            {event.description && (
              <ModalLinkBox>
                <ModalLinkLeft>
                  <FileIcon width={22} height={22} />
                  <ModalLinkContent>
                    <ModalLinkLabel>Деталі</ModalLinkLabel>
                    <SecondaryText>{event.description}</SecondaryText>
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

const SecondaryText = styled.span`
  font-family: 'e-Ukraine', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.32px;
  color: var(--base-secondary-text, #6b6b6b);
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
