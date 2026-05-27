import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectLeaveQueueModalOpen,
  selectLeaveQueueSessionId,
  selectLeaveQueueUsedToken,
  selectLeaveQueueStatus,
  selectLeaveQueueUserPosition,
} from '../../store/selectors/uiSelector.js';
import { closeLeaveQueueModal } from '../../store/uiSlice.js';
import { useLeaveQueueMutation } from '../../store/api/queueApi.js';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import LightningIcon from '../../assets/lightning_fill.svg?react';
import { toast } from '../../utils/toast.js';

const LeaveQueueModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectLeaveQueueModalOpen);
  const sessionId = useSelector(selectLeaveQueueSessionId);
  const usedToken = useSelector(selectLeaveQueueUsedToken);
  const queueStatus = useSelector(selectLeaveQueueStatus);
  const userPosition = useSelector(selectLeaveQueueUserPosition);

  const [leaveQueue, { isLoading }] = useLeaveQueueMutation();

  const handleClose = () => {
    dispatch(closeLeaveQueueModal());
  };

  const handleConfirm = async () => {
    try {
      await leaveQueue(sessionId).unwrap();
      toast.success('Ви успішно скасували свій запис');
      handleClose();
    } catch (error) {
      toast.error(error.data?.message || 'Помилка при скасуванні запису');
    }
  };

  const willRefundToken = usedToken && queueStatus === 'Registration';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} width="34.375rem">
      <Content>
        <Title>Скасувати запис?</Title>
        <Description>
          <p>
            Ви втратите своє поточне <strong>{userPosition}</strong> місце в
            черзі
          </p>
          <p>Цю дію не можна скасувати</p>
        </Description>

        {usedToken && (
          <TokenBox $variant={willRefundToken ? 'success' : 'error'}>
            <IconWrapper $variant={willRefundToken ? 'success' : 'error'}>
              <LightningIcon />
            </IconWrapper>
            <TokenInfo>
              <TokenTitle>Повернення токена</TokenTitle>
              <TokenDesc>
                Ваш токен{' '}
                <span>{willRefundToken ? 'буде повернено' : 'не буде повернено'}</span>
              </TokenDesc>
            </TokenInfo>
          </TokenBox>
        )}

        <Actions>
          <Button $fullWidth onClick={handleConfirm} disabled={isLoading}>
            Так, скасувати запис
          </Button>
          <Button
            variant="secondary"
            $fullWidth
            onClick={handleClose}
            disabled={isLoading}
          >
            Ні, залишитися в черзі
          </Button>
        </Actions>
      </Content>
    </Modal>
  );
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const Title = styled.h2`
  font-size: 2.375rem; /* 38px */
  font-weight: 400;
  line-height: 2.5rem;
  color: var(--base-black);
  text-align: center;
`;

const Description = styled.div`
  text-align: center;
  color: var(--base-black);
  font-size: 1.125rem; /* 18px */
  line-height: 1.75rem;

  p {
    margin: 0;
  }

  strong {
    font-weight: 700;
    letter-spacing: -0.0225rem;
  }
`;

const TokenBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  border: 2px solid
    ${({ $variant }) =>
      $variant === 'success' ? 'var(--malachite-100)' : 'var(--brick-red-100)'};
  border-radius: 0.75rem;
`;

const IconWrapper = styled.div`
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 1.125rem;
    height: 1.125rem;
    fill: ${({ $variant }) =>
      $variant === 'success' ? 'var(--malachite-100)' : 'var(--brick-red-100)'};
  }
`;

const TokenInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const TokenTitle = styled.span`
  font-size: 1.25rem; /* 20px */
  font-weight: 400;
  line-height: 1.5rem;
`;

const TokenDesc = styled.span`
  font-size: 1rem; /* 16px */
  font-weight: 300;
  line-height: 1.5rem;

  span {
    font-weight: 500;
  }
`;

const Actions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export default LeaveQueueModal;
