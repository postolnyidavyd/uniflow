import styled, { css } from 'styled-components';
import UserIcon from '../../assets/UsersSmall.svg?react';
import UsersIcon from '../../assets/User_03.svg?react';
import ClockIcon from '../../assets/ClockSmall.svg?react';
import MapPinIcon from '../../assets/Map_Pin.svg?react';
import AttachmentIcon from '../../assets/Paperclip_Attechment_Tilt.svg?react';
import { formatDateModal } from '../../utils/ISODateParser.js';
import TextButton from '../ui/TextButton.jsx';
import Button from '../ui/Button.jsx';
import { useDispatch } from 'react-redux';
import { openLeaveQueueModal } from '../../store/uiSlice.js';
import { useCompleteCurrentEntryMutation } from '../../store/api/queueApi.js';
import { toast } from '../../utils/toast.js';
import { useNavigate } from 'react-router-dom';

const REGISTRATION = 'Registration';
const ACTIVE = 'Active';


const myCardStyles = {
  focus: {
    color: 'var(--brick-red-100)',
    text: 'Активний запис',
  },
  presenting: {
    color: 'var(--brick-red-100)',
    text: 'Ваша черга',
  },
  guaranteed: {
    color: 'var(--malachite-100, #04C65D)',
    text: 'Гарантоване місце',
  },
  reserve: {
    color: 'var(--gorse-100, #FFDB4D)',
    text: 'Резерв',
  },
};

const getPluralPeople = (count) => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'людей';
  if (lastDigit === 1) return 'людина';
  if (lastDigit >= 2 && lastDigit <= 4) return 'людини';
  return 'людей';
};

const MyQueueCard = ({
  id,
  shortTitle,
  subjectName,
  queueStartTime,
  location,
  meetUrl,
  userPosition,
  isGuaranteed,
  currentStudentName,
  estimatedWaitMinutes,
  queueStatus,
  usedToken,
}) => {
  const dispatch = useDispatch();
  const [completeCurrentEntry] = useCompleteCurrentEntryMutation();
  const navigate = useNavigate();
  const isPresenting = userPosition === 1 && queueStatus === ACTIVE;
  const focus = queueStatus === ACTIVE;

  const styles = isPresenting
    ? myCardStyles.presenting
    : focus
      ? myCardStyles.focus
      : isGuaranteed
        ? myCardStyles.guaranteed
        : myCardStyles.reserve;

  const peopleCount = userPosition - 1;

  const handleClick = (e) => {
    e.stopPropagation();
    navigate(`/queues/${id}`);
  };
  const handleCancel = (e) => {
    e.stopPropagation();
    dispatch(
      openLeaveQueueModal({
        sessionId: id,
        usedToken,
        queueStatus,
        userPosition,
      })
    );
  };

  const handleFinish = async (e) => {
    e.stopPropagation();
    try {
      await completeCurrentEntry(id).unwrap();
      toast.success('Запис успішно завершено', 'Гарна робота!');
    } catch {
      toast.error('Помилка', 'Не вдалося завершити запис');
    }
  };

  return (
    <MyQueueCardContainer $color={styles.color} onClick={handleClick}>
      <LeftSide>
        <QueueCardBadge $focus={focus}>
          <Dot $bgColor={styles.color} />
          {styles.text}
        </QueueCardBadge>
        <h3>
          {subjectName} - {shortTitle}
        </h3>
        {queueStatus === REGISTRATION ? (
          <>
            <InfoContainer>
              <ClockIcon />
              {formatDateModal(queueStartTime)}
            </InfoContainer>
            {location && (
              <InfoContainer>
                <MapPinIcon />
                {location}
              </InfoContainer>
            )}
            {meetUrl && (
              <InfoContainer>
                <AttachmentIcon />
                <StyledLink
                  href={meetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  {meetUrl}
                </StyledLink>
              </InfoContainer>
            )}
          </>
        ) : !isPresenting ? (
          <>
            <InfoContainer>
              <UserIcon />
              Зараз: {currentStudentName}
            </InfoContainer>
            <InfoContainer>
              <UsersIcon />
              Перед вами: {peopleCount} {getPluralPeople(peopleCount)}
            </InfoContainer>
          </>
        ) : null}
      </LeftSide>
      <RightSide>
        {isPresenting ? (
          <Button onClick={handleFinish}>Я здав(ла)</Button>
        ) : (
          <>
            <h3>Ваша позиція</h3>
            <h1>{userPosition}</h1>
            {queueStatus === ACTIVE && estimatedWaitMinutes && (
              <EstimatedTime>~{estimatedWaitMinutes} хв</EstimatedTime>
            )}
            <TextButton size="sm" onClick={handleCancel}>
              Скасувати запис
            </TextButton>
          </>
        )}
      </RightSide>
    </MyQueueCardContainer>
  );
};

const EstimatedTime = styled.p`
  font-size: var(--desktop-headings-h8);
  font-style: normal;
  font-weight: 400;
  line-height: 1.125rem; /* 18px */
  letter-spacing: -0.015rem;
  color: var(--base-black);
`;

const RightSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;

  h3 {
    font-size: var(--desktop-headings-h7);
    font-weight: 400;
    line-height: 1.5rem; /* 24px */
    letter-spacing: -0.02rem;
    color: var(--base-black);
  }

  h1 {
    font-size: var(--desktop-headings-h3);
    font-weight: 400;
    line-height: 2rem; /* 32px */
    letter-spacing: -0.035rem;
    margin: 0.125rem 0;
  }
`;

const StyledLink = styled.a`
  color: var(--base-black, #000);
  text-decoration: underline;
  text-decoration-skip-ink: none;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  font-size: 1rem;
  font-weight: 300;
`;

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  svg {
    width: 1.25rem;
    height: 1.25rem;
    aspect-ratio: 1/1;
  }

  color: var(--base-black, #000);

  font-size: 1.125rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5rem;
  letter-spacing: -0.02rem;
`;

const Dot = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  aspect-ratio: 1/1;
  border-radius: 50%;
  background-color: ${({ $bgColor }) =>
    $bgColor || 'var(--base-black)'};
`;

const QueueCardBadge = styled.div`
  display: flex;
  padding: 0.25rem 0.5rem;
  align-items: center;
  gap: 0.5rem;

  color: var(--base-black, #000);

  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5rem;
  letter-spacing: -0.025rem;

  ${({ $focus }) =>
    $focus &&
    css`
      border-radius: 0.5rem;
      background: var(--brick-red-20, #f4d5db);
    `}
`;

const LeftSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.375rem;
`;

const MyQueueCardContainer = styled.div`
  display: flex;
  padding: 1.25rem;
  justify-content: space-between;
  align-items: center;
  border-radius: 1.25rem;
  border: 2.5px solid ${({ $color }) => $color || 'var(--base-bright-grey)'};
  cursor: pointer;
  background: var(--base-white);

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }

  h3 {
    color: var(--base-black, #000);
    font-size: var(--desktop-headings-h4);
    font-style: normal;
    font-weight: 400;
    line-height: 1.75rem; /* 28px */
    letter-spacing: -0.03rem;
  }
`;

export default MyQueueCard;
