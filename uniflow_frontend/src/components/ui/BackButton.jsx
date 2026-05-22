import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ArrowLeftIcon from '../../assets/Arrow Left.svg?react';

const BackButton = ({ to, label = 'Назад', className }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <StyledBackButton onClick={handleBack} className={className}>
      <ArrowLeftIcon width="1.5rem" height="1.5rem" />
      <span>{label}</span>
    </StyledBackButton>
  );
};

const StyledBackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem 0.5rem 0.5rem;
  background: transparent;
  border: none;
  border-radius: 0.875rem;
  cursor: pointer;
  color: var(--base-black, #000);
  font-family: 'e-Ukraine', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  margin-left: -0.5rem;
  width: fit-content;

  transition: 
    background-color 0.3s ease,
    transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: var(--base-bright-grey, #e7eef3);
  }

  &:active {
    transform: scale(0.96);
  }

  span {
    line-height: 1;
    user-select: none;
  }
`;


export default BackButton;
