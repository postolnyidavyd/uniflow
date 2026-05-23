import styled, { keyframes } from 'styled-components';

export const skeletonPulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

export const SkeletonLine = styled.div`
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || '1.25rem'};
  background: ${({ $variant }) => 
    $variant === 'light' ? 'rgba(255, 255, 255, 0.15)' : 'var(--base-bright-grey, #e7eef3)'};
  border-radius: ${({ $borderRadius }) => $borderRadius || '0.5rem'};
  animation: ${skeletonPulse} 1.5s infinite ease-in-out;
  flex-shrink: 0;
`;

export const SkeletonCircle = styled.div`
  width: ${({ $size }) => $size || '3rem'};
  height: ${({ $size }) => $size || '3rem'};
  background: ${({ $variant }) => 
    $variant === 'light' ? 'rgba(255, 255, 255, 0.15)' : 'var(--base-bright-grey, #e7eef3)'};
  border-radius: 50%;
  animation: ${skeletonPulse} 1.5s infinite ease-in-out;
  flex-shrink: 0;
`;
