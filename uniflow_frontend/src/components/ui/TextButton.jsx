import styled, { css } from 'styled-components';

const sizes = {
  sm: css`
    height: 2.5rem; /* 40px */
    padding: 0.5rem 1.25rem;
    font-size: var(--desktop-headings-h8); /* 13px */
    line-height: 1rem;
    letter-spacing: -0.02rem;
    
    & ${'div'}::after {
      bottom: -0.125rem;
    }
  `,
  lg: css`
    height: 3.5rem; /* 56px */
    padding: 1rem 1.875rem;
    font-size: var(--desktop-headings-h7); /* 16px */
    line-height: 1.5rem;
    letter-spacing: -0.02rem;

    & ${'div'}::after {
      bottom: -0.25rem;
    }
  `,
};

const TextContent = styled.div`
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background-color: var(--base-black);
    transform: scaleX(0);
    transition: transform 0.2s ease-out;
  }
`;

const StyledTextButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: none;
  border: none;
  border-radius: 2.5rem;
  cursor: pointer;
  white-space: nowrap;
  
  color: var(--grey-100);
  font-family: 'e-Ukraine', sans-serif;
  font-weight: 400;
  
  transition: color 0.2s ease-out;

  &:hover:not(:disabled) {
    color: var(--base-black);
    
    ${TextContent}::after {
      transform: scaleX(1);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ $size }) => sizes[$size] || sizes.lg}
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  color: inherit;

  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
    
    path {
        fill: currentColor;
    }
  }
`;

const TextButton = ({
  size = 'lg',
  iconLeft,
  iconRight,
  fullWidth = false,
  children,
  ...props
}) => {
  return (
    <StyledTextButton $size={size} $fullWidth={fullWidth} {...props}>
      {iconLeft && <IconWrapper>{iconLeft}</IconWrapper>}
      <TextContent>{children}</TextContent>
      {iconRight && <IconWrapper>{iconRight}</IconWrapper>}
    </StyledTextButton>
  );
};

export default TextButton;
