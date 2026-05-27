import styled from 'styled-components';
import Button from '../ui/Button.jsx';
import LightningIcon from '../../assets/lightning_fill.svg?react';
import { useDispatch } from 'react-redux';
import { openLeaveQueueModal } from '../../store/uiSlice.js';
import { useCompleteCurrentEntryMutation } from '../../store/api/queueApi.js';
import { toast } from '../../utils/toast.js';

import { useTimer } from '../../hooks/useTimer.js';

const UserStatusCard = ({
  sessionId,
  entry,
  queueStatus,
  position,
}) => {
  const dispatch = useDispatch();
  const [completeSubmission, { isLoading: isCompleting }] =
    useCompleteCurrentEntryMutation();

  const timerValue = useTimer(entry?.entryStatus === 'InProgress');

  if (!entry) return null;

  const { usedToken, entryStatus, username, entryType } = entry;
  const isNext =
    position === 1 && entryStatus === 'Waiting' && queueStatus === 'Active';
  const isMyTurn = entryStatus === 'InProgress';
  const isCompleted = entryStatus === 'Completed';
  
  if (isCompleted) return null;

  const handleLeave = () => {
    dispatch(
      openLeaveQueueModal({
        sessionId,
        usedToken,
        queueStatus,
        userPosition: position,
      })
    );
  };

  const handleComplete = async () => {
    try {
      await completeSubmission(sessionId).unwrap();
      toast.success('Вітаємо зі здачею!');
    } catch {
      toast.error('Не вдалося відмітити здачу');
    }
  };

  // Визначаємо колір рамки
  const getBorderColor = () => {
    if (isNext || isMyTurn) return 'var(--brick-red-100)';
    if (usedToken) return 'var(--gorse-100)';
    return 'var(--malachite-100)';
  };

  return (
    <CardContainer $borderColor={getBorderColor()} $isColumn={isNext}>
      <MainInfo>
        <PositionSection>
          <Label>{isMyTurn ? 'Ваша черга!' : 'Ваша позиція:'}</Label>
          <PositionRow>
            <PositionNumber>{position}</PositionNumber>
            <UserDetail>
              <UserNameRow>
                <UserName>{username}</UserName>
                {entryType === 'Secondary' && (
                  <SecondaryLabel>(2-га робота)</SecondaryLabel>
                )}
              </UserNameRow>
              {usedToken && (
                <PriorityBadge>
                  <LightningIcon width={24} height={24} />
                  <span>Пріоритетний запис</span>
                </PriorityBadge>
              )}
            </UserDetail>
          </PositionRow>
        </PositionSection>

        {!isMyTurn && (
          <ActionsSection>
            <Button variant="secondary" size="md" onClick={handleLeave}>
              Скасувати запис
            </Button>
            <Hint>
              {isNext
                ? 'При скасуванні зараз токен не буде повернуто.'
                : 'При скасуванні зараз токен буде повернуто.'}
            </Hint>
          </ActionsSection>
        )}

        {isMyTurn && (
          <ActionsSection>
            <Button
              variant="primary"
              size="md"
              onClick={handleComplete}
              isLoading={isCompleting}
              disabled={isCompleting}
            >
              Я здав(ла) роботу
            </Button>
            <TimerWrapper>
              <TimerLabel>Час здачі: </TimerLabel>
              <TimerValue>{timerValue}</TimerValue>
            </TimerWrapper>
          </ActionsSection>
        )}
      </MainInfo>

      {isNext && <AlertBox>Ви наступний. Приготуйтесь!</AlertBox>}
    </CardContainer>
  );
};

const CardContainer = styled.div`
  display: flex;
  flex-direction: ${({ $isColumn }) => ($isColumn ? 'column' : 'row')};
  gap: ${({ $isColumn }) => ($isColumn ? '2rem' : '1rem')};
  padding: 1rem 2rem;
  border-radius: 1.25rem;
  border: 1.901px solid ${({ $borderColor }) => $borderColor};
  background: var(--base-white);
  width: 100%;
  max-width: 950px;
  align-self: center;
`;

const MainInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const PositionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

const Label = styled.p`
  font-size: var(--desktop-headings-h5);
  font-weight: 400;
  color: var(--base-black);
  margin: 0;
`;

const PositionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const PositionNumber = styled.span`
  font-size: var(--desktop-headings-h1);
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.07rem;
  color: var(--base-black);
`;

const UserDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

const UserNameRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
`;

const UserName = styled.p`
  font-size: var(--desktop-headings-h5);
  font-weight: 400;
  color: var(--base-black);
  margin: 0;
`;

const SecondaryLabel = styled.span`
  font-size: var(--desktop-headings-h7);
  font-weight: 400;
  color: var(--base-black);
  opacity: 0.6;
`;

const PriorityBadge = styled.div`
  display: flex;
  padding: 0.25rem 0.5rem;
  align-items: center;
  gap: 0.5rem;
  background: var(--gorse-100);
  border-radius: 0.5rem;
  font-size: var(--desktop-headings-h5);
  color: var(--base-black);

  svg {
    flex-shrink: 0;
  }
`;

const ActionsSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.625rem;
`;

const Hint = styled.p`
  font-size: var(--desktop-headings-h7);
  font-weight: 300;
  color: var(--base-black);
  opacity: 0.6;
  text-align: right;
  margin: 0;
`;

const TimerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TimerLabel = styled.span`
  font-size: var(--desktop-headings-h7);
  font-weight: 300;
  color: var(--base-black);
  opacity: 0.6;
`;

const TimerValue = styled.span`
  font-size: var(--desktop-headings-h5);
  font-weight: 400;
  color: var(--base-black);
`;

const AlertBox = styled.div`
  width: 100%;
  padding: 0.25rem 0.5rem;
  background: var(--brick-red-100);
  border-radius: 0.5rem;
  color: var(--base-white);
  font-size: var(--desktop-headings-h4);
  font-weight: 400;
  text-align: center;
  line-height: 1.75rem;
`;

export default UserStatusCard;
