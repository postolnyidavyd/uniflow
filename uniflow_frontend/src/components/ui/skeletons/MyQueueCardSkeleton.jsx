import styled from 'styled-components';
import { SkeletonLine, skeletonPulse } from './SkeletonBase.jsx';

export const MyQueueCardSkeleton = () => {
  return (
    <SkeletonCard>
      <LeftSide>
        <BadgePlaceholder>
          <DotPlaceholder />
          <SkeletonLine $width="8rem" $height="1rem" />
        </BadgePlaceholder>
        <SkeletonLine $width="18rem" $height="2.5rem" style={{ margin: '0.375rem 0' }} />
        <InfoBlock>
          <SkeletonLine $width="12rem" $height="1.25rem" />
          <SkeletonLine $width="10rem" $height="1.25rem" />
        </InfoBlock>
      </LeftSide>
      <RightSide>
        <SkeletonLine $width="8rem" $height="1.5rem" />
        <SkeletonLine $width="4rem" $height="3rem" style={{ margin: '0.5rem 0' }} />
        <SkeletonLine $width="6rem" $height="1.25rem" />
      </RightSide>
    </SkeletonCard>
  );
};

const SkeletonCard = styled.div`
  display: flex;
  padding: 1.25rem;
  justify-content: space-between;
  align-items: center;
  border-radius: 1.25rem;
  border: 2.5px solid var(--base-bright-grey, #e7eef3);
  background: var(--base-white);
`;

const LeftSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.375rem;
`;

const BadgePlaceholder = styled.div`
  display: flex;
  padding: 0.25rem 0.5rem;
  align-items: center;
  gap: 0.5rem;
`;

const DotPlaceholder = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: var(--base-bright-grey);
  flex-shrink: 0;
  animation: ${skeletonPulse} 1.5s infinite ease-in-out;
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RightSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;
