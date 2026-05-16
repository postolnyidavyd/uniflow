import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import Close_MD from '../../assets/Close_MD.svg?react';

const Modal = ({ isOpen, onClose, title, children, width }) => {
  const dialogRef = useRef(null);
  const isMousedownInside = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }

    return () => {
      if (dialog.open) dialog.close();
    };
  }, [isOpen]);

  const isInsideDialog = (e) => {
    if (!dialogRef.current) return false;
    const rect = dialogRef.current.getBoundingClientRect();
    return (
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top && e.clientY <= rect.bottom
    );
  };

  const handleMouseDown = (e) => {
    isMousedownInside.current = isInsideDialog(e);
  };

  const handleMouseUp = (e) => {
    if (!isInsideDialog(e) && !isMousedownInside.current) onClose();
    isMousedownInside.current = false;
  };

  return createPortal(
    <StyledDialog
      ref={dialogRef}
      $width={width}
      onClose={onClose}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >{(title || onClose) && (
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
  border: 1.901px solid var(--base-bright-grey);
  border-radius: 1.25rem;
  background: var(--base-white);
  padding: 0;
  margin: auto;
  overflow-y: auto;

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
`;

const ModalTitle = styled.div`
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 1.75rem;
  color: var(--base-black);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.5rem;

  &:hover {
    background-color: var(--grey-20);
  }
`;

const ModalBody = styled.div`
  padding: 0 1.5rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export default Modal;