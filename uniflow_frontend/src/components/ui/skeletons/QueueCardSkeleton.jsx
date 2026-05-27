import styled from 'styled-components';
import { SkeletonLine, skeletonPulse } from './SkeletonBase.jsx';

export const QueueCardSkeleton = () => {
  return (
    <SkeletonCard>
      <StatusRow>
        <DotPlaceholder />
        <SkeletonLine $width="7rem" $height="0.875rem" />
      </StatusRow>

      <SkeletonLine $width="85%" $height="1.75rem" />
      <SkeletonLine $width="60%" $height="1.75rem" />

      <InfoBlock>
        <SkeletonLine $width="9rem" $height="1rem" />
        <SkeletonLine $width="8rem" $height="1rem" />
      </InfoBlock>

      <BottomRow>
        <SkeletonLine $width="3rem" $height="1.75rem" />
        <SkeletonLine $width="7rem" $height="2.25rem" $borderRadius="2rem" />
      </BottomRow>
    </SkeletonCard>
  );
};

const SkeletonCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 0.625rem;
  border-radius: 1.25rem;
  border: 1.901px solid var(--base-bright-grey, #e7eef3);
  background: var(--base-white);
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DotPlaceholder = styled.div`
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: var(--base-bright-grey);
  flex-shrink: 0;
  animation: ${skeletonPulse} 1.5s infinite ease-in-out;
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  flex: 1;
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
`;
