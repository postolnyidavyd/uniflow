import styled, { keyframes } from 'styled-components';

const spin = keyframes`to { transform: rotate(360deg); }`;
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`;

const sizes = {
  sm: { ring: '24px', border: '2px' },
  md: { ring: '40px', border: '3px' },
  lg: { ring: '56px', border: '3px' },
};

const Ring = styled.div`
  width: ${({ $size }) => sizes[$size].ring};
  height: ${({ $size }) => sizes[$size].ring};
  border-radius: 50%;
  border: ${({ $size }) => sizes[$size].border} solid rgba(100, 128, 109, 0.2);
  border-top-color: var(--aaccent-color);
  animation: ${spin} 0.8s linear infinite;
  flex-shrink: 0;
`;

const DotsWrapper = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const Dot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--aaccent-color);
  animation: ${pulse} 1.2s ease-in-out infinite;
  animation-delay: ${({ $i }) => $i * 0.2}s;
`;

const FullWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  min-height: 100dvh;
`;

const LoadingText = styled.p`
  font-size: var(--desktop-headings-h8);
  color: var(--base-secondary-text);
  margin: 0;
`;

// size: 'sm' | 'md' | 'lg'
// variant: 'ring' | 'dots'
// fullscreen: true рендерить по центру екрану з текстом
function Spinner({ size = 'md', variant = 'ring', fullscreen = false }) {
  const spinner = variant === 'dots'
    ? <DotsWrapper>{[0,1,2].map(i => <Dot key={i} $i={i} />)}</DotsWrapper>
    : <Ring $size={size} />;

  if (fullscreen) {
    return (
      <FullWrapper>
        <Ring $size="lg" />
        <LoadingText>Завантаження...</LoadingText>
      </FullWrapper>
    );
  }

  return spinner;
}

export default Spinner;