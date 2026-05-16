import styled from 'styled-components';
import { forwardRef } from 'react';
import CalendarIcon from '../../../assets/Calendar.svg?react';
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  width: 100%;
  padding-top: 1.25rem;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
  svg {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    width: 20px;
    height: 20px;
    color: var(--base-black);
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.25rem 2rem 0.5rem 0;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.5rem;
  letter-spacing: -0.02rem;
  color: var(--base-black);
  background-color: transparent;
  border: none;
  border-bottom: 0.125rem solid
    ${({ $error }) =>
      $error ? 'var(--brick-red-100, #E42939)' : 'var(--base-black)'};
  border-radius: 0;
  outline: none;
  color-scheme: light;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &::-webkit-calendar-picker-indicator {
    opacity: 0;
    position: absolute;
    right: 0;
    width: 24px;
    height: 24px;
    cursor: pointer;
  }

  &:focus {
    border-bottom-color: ${({ $error }) =>
      $error ? 'var(--brick-red-100, #E42939)' : 'var(--base-black)'};
    box-shadow: 0 1px 0 0
      ${({ $error }) =>
        $error ? 'var(--brick-red-100, #E42939)' : 'var(--base-black)'};
  }

  &:disabled {
    border-bottom-color: var(--grey-40);
    color: var(--grey-60);
    cursor: not-allowed;
  }
`;

const StyledLabel = styled.label`
  position: absolute;
  left: 0;
  top: -4px;
  transform: translateY(-100%);
  font-size: 0.75rem;
  font-weight: 300;
  line-height: 1rem;
  color: var(--grey-100);
  pointer-events: none;
`;

const ErrorText = styled.p`
  font-size: 0.8rem;
  color: var(--brick-red-100, #e42939);
  margin: 0;
`;

const DateTimeInput = forwardRef(({ label, id, error, ...props }, ref) => {
  const inputId =
    id || `datetime-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <Wrapper>
      <InputContainer>
        <StyledInput
          id={inputId}
          ref={ref}
          type="datetime-local"
          $error={!!error}
          {...props}
        />
        <StyledLabel htmlFor={inputId}>{label}</StyledLabel>
        <CalendarIcon />
      </InputContainer>
      {error && <ErrorText>{error}</ErrorText>}
    </Wrapper>
  );
});

DateTimeInput.displayName = 'DateTimeInput';
export default DateTimeInput;
