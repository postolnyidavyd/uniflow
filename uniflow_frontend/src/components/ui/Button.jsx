import styled, { css, keyframes } from 'styled-components';

const granimateRadial = keyframes`
  0% { background-position: 10% 10%; }
  25% { background-position: 90% 10%; }
  50% { background-position: 90% 90%; }
  75% { background-position: 10% 90%; }
  100% { background-position: 10% 10%; }
`;


const magicGradient = css`
  background-color: var(--base-white, #ffffff);
  background-image:
    radial-gradient(circle at 50% 100%, rgba(4, 198, 93, 0.9), transparent 75%),
    radial-gradient(circle at 0% 0%, rgba(255, 56, 0, 0.9), transparent 75%),
    radial-gradient(circle at 100% 0%, rgba(91, 90, 255, 0.9), transparent 75%);
  background-size: 150% 150%;
  animation: ${granimateRadial} 10s ease infinite;
  background-origin: border-box;
`;

const variants = {
  primary: css`
    background-color: transparent;
    color: var(--base-white);

    
    &::before {
      content: '';
      position: absolute;
      inset: -1.5px;
      background-color: var(--base-black);
      border-radius: inherit;
      z-index: -2;
    }
    
    &::after {
      content: '';
      position: absolute;
      inset: -1.5px; 
      border-radius: inherit;
      ${magicGradient};
      opacity: 0;
      z-index: -1;
      transition: opacity 0.3s ease;
    }

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

      &::after {
        opacity: 1;
      }
    }
  `,

  secondary: css`
    background-color: transparent;
    color: var(--base-black);
    
    box-shadow: inset 0 0 0 1.5px var(--base-black);
    transition: all 0.3s ease;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      padding: 1.5px;
      ${magicGradient};
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;

      opacity: 0; /* Сховано */
      transition: opacity 0.3s ease;
    }

    &:hover:not(:disabled) {
      background-color: rgba(
        0,
        0,
        0,
        0.03
      ); 
      box-shadow: inset 0 0 0 1.5px transparent; 
      transform: translateY(-1px);

      &::after {
        opacity: 1; 
      }
    }
  `,

  ghost: css`
    background-color: transparent;
    color: var(--grey-100);
    &:hover:not(:disabled) {
      background-color: var(--grey-20);
    }
  `,

  danger: css`
    background-color: var(--brick-red-100);
    color: white;
    &:hover:not(:disabled) {
      opacity: 0.9;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(204, 46, 79, 0.3); 
    }
  `,
};

const sizes = {
  sm: css`
    padding: 0.375rem 0.75rem;
    font-size: var(--desktop-headings-h8);
  `,
  md: css`
    padding: 0.625rem 1.25rem;
    font-size: var(--desktop-headings-h7);
  `,
  lg: css`
    padding: 0.875rem 1.75rem;
    font-size: var(--desktop-headings-h6);
  `,
};

const StyledButton = styled.button`
  position: relative; 
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1.5px solid transparent;
  border-radius: 2.5rem;

  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  z-index: 1;

  transition:
    transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.2s ease,
    background-color 0.2s ease;

  
  &:active:not(:disabled) {
    transform: scale(0.96) !important; 
    box-shadow: none !important;
  }

  
  &:focus-visible {
    outline: 2px solid var(--radiance-100, #007eff);
    outline-offset: 2px;
  }

  ${({ $size }) => sizes[$size] || sizes.md}
  ${({ $variant }) => variants[$variant] || variants.primary}

  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  ...props
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
