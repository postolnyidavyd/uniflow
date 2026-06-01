import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
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

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Backdrop 
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <StyledDialog
            $width={width}
            open
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300, duration: 0.2 }}
          >
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
        </ModalOverlay>
      )}
    </AnimatePresence>,
    document.getElementById('modal')
  );
};

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
`;

const Backdrop = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: -1;
`;

const StyledDialog = styled(motion.dialog)`
  position: relative;
  width: 100%;
  max-width: ${({ $width }) => $width || '42rem'};
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
