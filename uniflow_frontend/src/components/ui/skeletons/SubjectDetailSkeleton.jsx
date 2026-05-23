import styled from 'styled-components';
import { SkeletonLine } from './SkeletonBase.jsx';

export const SubjectDetailSkeleton = () => {
  return (
    <SkeletonContainer>
      {/* Back Button Skeleton */}
      <SkeletonLine $width="6rem" $height="1.5rem" />

      <HeaderRowSkeleton>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* Main Title H1 */}
          <SkeletonLine $width="70%" $height="3.5rem" />
          {/* Lecturer Subtitle H4 */}
          <SkeletonLine $width="40%" $height="1.5rem" />
        </div>

        {/* Action Buttons Column */}
        <ActionSkeleton>
          <SkeletonLine $width="17rem" $height="3.2rem" $borderRadius="0.75rem" />
          <SkeletonLine $width="17rem" $height="3.2rem" $borderRadius="0.75rem" />
        </ActionSkeleton>
      </HeaderRowSkeleton>

      {/* Content Area */}
      <ContentSkeleton>
        <SkeletonLine $width="100%" $height="1.25rem" />
        <SkeletonLine $width="95%" $height="1.25rem" />
        <SkeletonLine $width="98%" $height="1.25rem" />
        <SkeletonLine $width="60%" $height="1.25rem" />
        <div style={{ margin: '1rem 0' }} />
        <SkeletonLine $width="100%" $height="1.25rem" />
        <SkeletonLine $width="90%" $height="1.25rem" />
      </ContentSkeleton>
    </SkeletonContainer>
  );
};

const SkeletonContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const HeaderRowSkeleton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const ActionSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 17rem;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const ContentSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
`;
