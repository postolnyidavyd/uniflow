import Modal from '../../ui/Modal.jsx';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { selectCreateOptionsModal } from '../../../store/selectors/uiSelector.js';
import {
  closeCreateOptionsModal,
  openCreateEventModal,
  openCreateQueueModal,
} from '../../../store/uiSlice.js';
import UserAddIcon from '../../../assets/User_Add.svg?react';
import ClockIcon from '../../../assets/ClockBig.svg?react';

const CreateOptionsModal = () => {
  const { isOpen } = useSelector(selectCreateOptionsModal);
  const dispatch = useDispatch();
  const customTitle = <CustomTitle>Створити нову:</CustomTitle>;
  const handleClose = () => dispatch(closeCreateOptionsModal());
  const handleAddQueue = () => {
    handleClose();
    dispatch(openCreateQueueModal());
  };
  const handleAddDeadline = () => {
    handleClose();
    dispatch(openCreateEventModal('Deadline'));
  };
  const handleAddEvent = () => {
    handleClose();
    dispatch(openCreateEventModal('Event'));
  };
  // TODO: Додати хавер ефект для айтемів
  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={customTitle}>
      <CreateTypeContainer>
        <TypeBlock
          $iconColor="var(--gorse-100)"
          $iconBackgroundColor="var(--gorse-40)"
          onClick={handleAddQueue}
        >
          <UserAddIcon />
          <TextContainer>
            <h5>Створити чергу</h5>
            <p>Створити сесію здачі лабораторних\практичних робіт</p>
          </TextContainer>
        </TypeBlock>
        <TypeBlock
          $iconColor="var(--brick-red-100)"
          $iconBackgroundColor="var(--brick-red-20)"
          onClick={handleAddDeadline}
        >
          <ClockIcon />
          <TextContainer>
            <h5>Додати дедлайн</h5>
            <p>Встановити термін здачі завдань</p>
          </TextContainer>
        </TypeBlock>
        <TypeBlock
          $iconColor="var(--radiance-100)"
          $iconBackgroundColor="var(--radiance-20)"
          onClick={handleAddEvent}
        >
          <UserAddIcon />
          <TextContainer>
            <h5>Додати подію</h5>
            <p>Створити лекцію, зустріч, або іншу подію </p>
          </TextContainer>
        </TypeBlock>
      </CreateTypeContainer>
    </Modal>
  );
};
const CustomTitle = styled.h4`
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.75rem; /* 116.667% */
  letter-spacing: -0.00719rem;
`;
const CreateTypeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  align-self: stretch;
`;
const TypeBlock = styled.div`
  display: flex;
  padding: 0.75rem 0.5rem;
  align-items: center;
  gap: 1rem;
  align-self: stretch;

  border-radius: 0.75rem;
  border: 2px solid var(--base-bright-grey, #e7eef3);

  cursor: pointer;
  svg {
    width: 2rem;
    height: 2rem;
    border-radius: 0.25rem;
    color: ${({ $iconColor }) => $iconColor || 'var(--base-black)'};
    background-color: ${({ $iconBackgroundColor }) =>
      $iconBackgroundColor || 'var(--base-bright-grey)'};
  }
`;
const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.25rem;

  h5 {
    color: var(--base-black);
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.5rem; /* 120% */
    letter-spacing: -0.025rem;
  }
  p {
    color: var(--base-secondary-text, #6b6b6b);

    font-size: 0.75rem;
    font-style: normal;
    font-weight: 300;
    line-height: 1rem;
  }
`;
export default CreateOptionsModal;
