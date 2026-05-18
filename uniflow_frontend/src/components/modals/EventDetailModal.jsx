import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { closeEventDetailModal } from '../../store/uiSlice.js';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import EventTypeBadge from '../ui/EventTypeBadge.jsx';
import { useCountdown } from '../../hooks/useCountdown.js';
import { useGetEventByIdQuery } from '../../store/api/eventApi.js';
import { useToggleEventSubscriptionMutation } from '../../store/api/subscriptionApi.js';
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
import { formatDateModal } from '../../utils/ISODateParser.js';
import { toast } from '../../utils/toast.js';

const EventDetailModal = () => {
  const dispatch = useDispatch();
  const { isOpen, eventId } = useSelector((state) => state.ui.eventDetailModal);

  const { data: event, isLoading } = useGetEventByIdQuery(eventId, {
    skip: !eventId,
  });

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

  const customTitle = event ? (
    <ModalTitleWrapper>
      <ModalSubjectText>{event.subjectName}</ModalSubjectText>
      <EventTypeBadge type={event.eventType} />
    </ModalTitleWrapper>
  ) : null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={customTitle}>
      {isLoading && <SkeletonLine $height="40px" />}
      {!isLoading && !event && isOpen && (
        <ModalContent>
          <ModalBigTitle>Подію не знайдено</ModalBigTitle>
          <Button onClick={handleClose}>Закрити</Button>
        </ModalContent>
      )}
      {!isLoading && event && (
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

export default EventDetailModal;
