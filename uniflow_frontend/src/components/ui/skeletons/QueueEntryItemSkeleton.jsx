import styled from 'styled-components';
import { SkeletonLine, skeletonPulse } from './SkeletonBase.jsx';

export const QueueEntryItemSkeleton = () => {
  return (
    <SkeletonItem>
      <LeftSide>
        <BarPlaceholder />
        <SkeletonLine $width="1.5rem" $height="1.5rem" />
        <SkeletonCircleSmall />
        <SkeletonLine $width="12rem" $height="1.25rem" />
      </LeftSide>
      <SkeletonLine $width="4rem" $height="1.5rem" style={{ marginRight: '1rem' }} />
    </SkeletonItem>
  );
};

const SkeletonItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0.625rem;
  border: 1px solid var(--base-bright-grey);
  background: var(--base-white);
  overflow: hidden;
  width: 100%;
`;

const LeftSide = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BarPlaceholder = styled.div`
  width: 1rem;
  height: 3rem;
  background: var(--base-bright-grey);
  animation: ${skeletonPulse} 1.5s infinite ease-in-out;
`;

const SkeletonCircleSmall = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--base-bright-grey);
  animation: ${skeletonPulse} 1.5s infinite ease-in-out;
`;
