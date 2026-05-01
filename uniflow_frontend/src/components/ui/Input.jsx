import styled from 'styled-components';
import { forwardRef } from 'react';

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
`;
const StyledInput = styled.input`
  width: 100%;
  padding: 0.25rem 0 0.5rem 0;
  font-size: var(--desktop-base-body);
  color: var(--base-black, #000);
  background-color: transparent;
  border: none;
  /* Перевіряємо наявність помилки для базового стану */
  border-bottom: 0.125rem solid ${({ $error }) => $error ? 'var(--brick-red-100, #E42939)' : 'var(--base-black, #000)'};
  border-radius: 0;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &::placeholder {
    color: transparent;
  }

  &:focus {
    /* Зберігаємо червоний колір та тінь при фокусі, якщо є помилка */
    border-bottom-color: ${({ $error }) => $error ? 'var(--brick-red-100, #E42939)' : 'var(--base-black, #000)'};
    box-shadow: 0 1px 0 0 ${({ $error }) => $error ? 'var(--brick-red-100, #E42939)' : 'var(--base-black, #000)'};
  }

  &:disabled {
    border-bottom-color: var(--grey-40, #ccc);
    color: var(--grey-60, #999);
    cursor: not-allowed;
  }
`;

const StyledLabel = styled.label`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: var(--desktop-base-body);
  color: var(--grey-100, #959595);
  pointer-events: none;
  transition: all 0.2s ease-out;

  ${StyledInput}:focus ~ &,
  ${StyledInput}:not(:placeholder-shown) ~ & {
    top: -4px;
    transform: translateY(-100%);
    font-size: var(--desktop-base-tiny);
    color: var(--grey-100, #959595);
  }
`;

const ErrorText = styled.p`
  font-size: 0.8rem;
  color: var(--brick-red-100);
`;

const Input = forwardRef(({ label, id, error, ...props }, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  return (
    <Wrapper>
      <InputContainer>
        <StyledInput id={inputId} ref={ref} placeholder=" " $error={!!error} {...props} />
        <StyledLabel htmlFor={inputId}>{label}</StyledLabel>
      </InputContainer>
      {error && <ErrorText>{error}</ErrorText>}
    </Wrapper>
  );
});

Input.displayName = "Input";
export default Input;