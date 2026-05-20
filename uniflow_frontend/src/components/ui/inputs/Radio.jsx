import styled from 'styled-components';
import { forwardRef } from 'react';

const RadioWrapper = styled.label`
  display: inline-flex;
  align-items: center;
  gap: ${({ $size }) => ($size === '20px' ? '8px' : '12px')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  position: relative;
  user-select: none;
`;

const HiddenRadio = styled.input.attrs({ type: 'radio' })`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const StyledRadio = styled.div`
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  border: 2px solid ${({ disabled }) => (disabled ? 'var(--grey-40, #D5D5D5)' : 'var(--base-black, #000000)')};
  background-color: ${({ disabled }) => (disabled ? 'var(--grey-20, #EAEAEA)' : 'var(--base-white, #FFFFFF)')};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;

  ${HiddenRadio}:checked + &::after {
    content: '';
    width: ${({ $size }) => ($size === '20px' ? '10px' : '12px')};
    height: ${({ $size }) => ($size === '20px' ? '10px' : '12px')};
    background-color: ${({ disabled }) => (disabled ? 'var(--grey-100, #959595)' : 'var(--base-black, #000000)')};
    border-radius: 50%;
  }
`;

const LabelText = styled.span`
  font-family: 'e-Ukraine', sans-serif;
  font-weight: 400;
  color: ${({ disabled }) => (disabled ? 'var(--grey-100, #959595)' : 'var(--base-black, #000000)')};
  
  font-size: ${({ $size }) => ($size === '20px' ? '13px' : '18px')};
  line-height: ${({ $size }) => ($size === '20px' ? '16px' : '28px')};
  letter-spacing: ${({ $size }) => ($size === '20px' ? '-0.32px' : '-0.36px')};
`;

const Radio = forwardRef(({ label, size = '24px', disabled, className, ...props }, ref) => {
  return (
    <RadioWrapper $size={size} disabled={disabled} className={className}>
      <HiddenRadio ref={ref} disabled={disabled} {...props} />
      <StyledRadio $size={size} disabled={disabled} />
      {label && <LabelText $size={size} disabled={disabled}>{label}</LabelText>}
    </RadioWrapper>
  );
});

Radio.displayName = 'Radio';

export default Radio;
