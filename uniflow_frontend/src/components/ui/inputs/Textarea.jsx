import styled from 'styled-components';
import { forwardRef, useEffect, useRef, useImperativeHandle } from 'react';

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

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 0.25rem 0 0.5rem 0;
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
  resize: none;
  overflow: hidden;
  min-height: 2rem;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &::placeholder {
    color: transparent;
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
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.5rem;
  letter-spacing: -0.02rem;
  color: var(--grey-100);
  pointer-events: none;
  transition: all 0.2s ease-out;

  ${StyledTextarea}:focus ~ &,
  ${StyledTextarea}:not(:placeholder-shown) ~ & {
    top: -4px;
    transform: translateY(-100%);
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 300;
    color: var(--grey-100);
  }
`;

const ErrorText = styled.p`
  font-size: 0.8rem;
  color: var(--brick-red-100, #e42939);
  margin: 0;
`;

const Textarea = forwardRef(({ label, id, error, ...props }, ref) => {
  const innerRef = useRef(null);
  useImperativeHandle(ref, () => innerRef.current);

  const textareaId =
    id || `textarea-${Math.random().toString(36).substring(2, 9)}`;

  const adjustHeight = () => {
    if (innerRef.current) {
      innerRef.current.style.height = 'auto';
      innerRef.current.style.height = innerRef.current.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [props.value]);

  const handleInput = () => {
    adjustHeight();
  };

  return (
    <Wrapper>
      <InputContainer>
        <StyledTextarea
          id={textareaId}
          ref={innerRef}
          $error={!!error}
          placeholder=" "
          onInput={handleInput}
          rows={1}
          {...props}
        />
        <StyledLabel htmlFor={textareaId}>{label}</StyledLabel>
      </InputContainer>
      {error && <ErrorText>{error}</ErrorText>}
    </Wrapper>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;
