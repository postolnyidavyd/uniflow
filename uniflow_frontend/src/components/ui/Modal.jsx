import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import Close_MD from '../../assets/Close_MD.svg?react';

const Modal = ({ isOpen, onClose, title, children, width }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <ModalOverlay>
      <Backdrop onClick={onClose} />
      <StyledDialog $width={width} open>
        {(title || onClose) && (
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            {onClose && (
              <CloseButton type="button" onClick={onClose}>
                <Close_MD />
              </CloseButton>
            )}
          </ModalHeader>
        )}
        <ModalBody>{children}</ModalBody>
      </StyledDialog>
    </ModalOverlay>,
    document.getElementById('modal')
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
`;

const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: -1;
`;

const StyledDialog = styled.dialog`
  position: relative;
  width: ${({ $width }) => $width || 'max-content'};
  min-width: 34.375rem;
  max-height: 90dvh;
  border: 1.901px solid var(--base-bright-grey);
  border-radius: 1.25rem;
  background: var(--base-white);
  padding: 0;
  margin: 0; /* Remove default margin */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  color: inherit; /* Reset default dialog color */

  /* Reset default dialog styles */
  &::backdrop {
    display: none;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 0 1.5rem;
  margin-bottom: 2rem;
  flex-shrink: 0;
`;

const ModalTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.75rem;
  letter-spacing: -0.00719rem;
  color: var(--base-black, #000000);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  transition: all 180ms ease;

  &:hover {
    background-color: var(--grey-20, #f5f5f5);
    color: var(--base-secondary-text);
  }
`;

const ModalBody = styled.div`
  padding: 0 1.5rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  flex: 1;
  overflow-y: auto;
`;

export default Modal;
