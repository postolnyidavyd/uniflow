import styled from 'styled-components';
import { SkeletonLine, skeletonPulse } from './SkeletonBase.jsx';

export const UpcomingBlockSkeleton = () => {
  return (
    <SkeletonWrapper>
      <DateBoxPlaceholder />
      <InfoPlaceholder>
        <SkeletonLine $width="6rem" $height="0.875rem" />
        <SkeletonLine $width="9rem" $height="0.75rem" />
      </InfoPlaceholder>
    </SkeletonWrapper>
  );
};

const SkeletonWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 0.25rem 0.5rem;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.5rem;
  border: 1.901px solid var(--base-bright-grey);
  background: transparent;
`;

const DateBoxPlaceholder = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.625rem;
  background: var(--base-bright-grey, #e7eef3);
  animation: ${skeletonPulse} 1.5s infinite ease-in-out;
  flex-shrink: 0;
`;

const InfoPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.375rem;
  flex: 1;
`;
