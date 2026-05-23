import styled from 'styled-components';
import { SkeletonLine, skeletonPulse } from './SkeletonBase.jsx';

export const SubjectCardSkeleton = () => {
  return (
    <SkeletonCardContainer>
      <ImagePlaceholder />
      <SkeletonCardContent>
        <LeftSide>
          <SkeletonLine $width="4rem" $height="0.75rem" />
          <SkeletonLine $width="8rem" $height="1.125rem" />
        </LeftSide>
        <BadgePlaceholder />
      </SkeletonCardContent>
    </SkeletonCardContainer>
  );
};

const SkeletonCardContainer = styled.div`
  display: grid;
  height: 23.25rem;
  align-self: start;
  grid-template-rows: minmax(0, 4fr) minmax(0, 1fr);
  grid-template-columns: repeat(1, minmax(0, 1fr));
  justify-self: stretch;

  border-radius: 1.25rem;
  border: 1.901px solid var(--base-bright-grey, #e7eef3);
  overflow: hidden;
  background: var(--base-white, #fff);
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: var(--base-bright-grey, #e7eef3);
  animation: ${skeletonPulse} 1.5s infinite ease-in-out;
`;

const SkeletonCardContent = styled.div`
  display: flex;
  height: 4.375rem;
  padding: 0.625rem;
  justify-content: space-between;
  align-items: center;
  align-self: start;
  grid-row: 2 / span 1;
  grid-column: 1 / span 1;
  justify-self: stretch;
`;

const LeftSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
`;

const BadgePlaceholder = styled.div`
  width: 6rem;
  height: 1.5rem;
  background: var(--base-bright-grey, #e7eef3);
  border-radius: 2rem;
  animation: ${skeletonPulse} 1.5s infinite ease-in-out;
`;
