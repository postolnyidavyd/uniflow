import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { closeConfirmationModal } from '../../../store/uiSlice.js';
import { executeConfirmCallback } from '../../../store/confirmationService.js';
import Modal from '../../ui/Modal.jsx';
import Button from '../../ui/Button.jsx';
import TriangleWarningIcon from '../../../assets/Triangle_Warning.svg?react';

const ConfirmationModal = () => {
  const dispatch = useDispatch();
  const { 
    isOpen, 
    title, 
    description, 
    confirmText, 
    cancelText, 
    isLoading 
  } = useSelector((state) => state.ui.confirmationModal);

  const handleClose = () => {
    if (!isLoading) {
      dispatch(closeConfirmationModal());
    }
  };

  const handleConfirm = () => {
    executeConfirmCallback();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} width="34.375rem">
      <Content>
        <IconWrapper>
          <TriangleWarningIcon width={48} height={48} />
        </IconWrapper>
        
        <Title>{title || 'Ви впевнені?'}</Title>
        
        {description && <Description>{description}</Description>}

        <Actions>
          <Button 
            variant="primary" 
            $fullWidth 
            onClick={handleConfirm} 
            disabled={isLoading}
          >
            {confirmText || 'Підтвердити'}
          </Button>
          <Button
            variant="secondary"
            $fullWidth
            onClick={handleClose}
            disabled={isLoading}
          >
            {cancelText || 'Скасувати'}
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
  padding: 1rem 0;
`;

const IconWrapper = styled.div`
  color: var(--brick-red-100);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h2`
  font-size: 2.375rem;
  font-weight: 400;
  line-height: 2.5rem;
  color: var(--base-black);
  text-align: center;
  margin: 0;
`;

const Description = styled.p`
  text-align: center;
  color: var(--base-black);
  font-size: 1.125rem;
  line-height: 1.75rem;
  opacity: 0.7;
  margin: 0;
`;

const Actions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export default ConfirmationModal;
