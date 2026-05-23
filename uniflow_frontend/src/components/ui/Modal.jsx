import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import Close_MD from '../../assets/Close_MD.svg?react';

const Modal = ({ isOpen, onClose, title, children, width }) => {
  const dialogRef = useRef(null);
  const shouldIgnoreClose = useRef(false);


  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    else if (!isOpen && dialog.open) dialog.close();

    return () => {
      if (dialog.open) dialog.close();
    };
  }, [isOpen]);


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

    let filePickerOpened = false;

    const handleBlur = () => {
      filePickerOpened = true;
      shouldIgnoreClose.current = true;
    };

    const handleFocus = () => {
      if (filePickerOpened) {
        filePickerOpened = false;
      }
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
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

  const isInsideDialog = (e) => {
    if (!dialogRef.current) return false;
    const rect = dialogRef.current.getBoundingClientRect();
    return (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
    );
  };

  const handleMouseDown = (e) => {
    shouldIgnoreClose.current = isInsideDialog(e);
  };

  const handleMouseUp = (e) => {
    if (e.clientX === 0 && e.clientY === 0) {
      shouldIgnoreClose.current = false;
      return;
    }

    if (shouldIgnoreClose.current) {
      shouldIgnoreClose.current = false;
      return;
    }

    if (!isInsideDialog(e) && onClose) {
      onClose();
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
  };

  return createPortal(
      <StyledDialog
          ref={dialogRef}
          $width={width}
          onCancel={handleCancel}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
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
      </StyledDialog>,
      document.getElementById('modal')
  );
};

const StyledDialog = styled.dialog`
  width: ${({ $width }) => $width || 'max-content'};
  min-width: 34.375rem;
  max-height: 90dvh;
  border: 1.901px solid var(--base-bright-grey);
  border-radius: 1.25rem;
  background: var(--base-white);
  padding: 0;
  margin: auto;
  overflow: hidden;

  &[open] {
    display: flex;
    flex-direction: column;
  }

  &::backdrop {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(2px);
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