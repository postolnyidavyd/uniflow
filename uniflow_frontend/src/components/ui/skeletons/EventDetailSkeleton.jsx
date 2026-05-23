import styled from 'styled-components';
import { SkeletonLine, SkeletonCircle } from './SkeletonBase.jsx';

export const EventDetailSkeleton = () => {
  return (
    <SkeletonContainer>
      {/* Title */}
      <SkeletonLine $width="80%" $height="2.5rem" />
      
      {/* Info Blocks */}
      <InfoList>
        <SkeletonRow>
          <SkeletonCircle $size="1.5rem" />
          <SkeletonLine $width="40%" $height="1.25rem" />
        </SkeletonRow>
        
        <SkeletonBox>
          <SkeletonCircle $size="2.5rem" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <SkeletonLine $width="30%" $height="0.75rem" />
            <SkeletonLine $width="100%" $height="1rem" />
          </div>
        </SkeletonBox>

        <SkeletonBox>
          <SkeletonCircle $size="2.5rem" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <SkeletonLine $width="30%" $height="0.75rem" />
            <SkeletonLine $width="80%" $height="1rem" />
          </div>
        </SkeletonBox>
      </InfoList>

      {/* Button */}
      <SkeletonLine $width="100%" $height="3rem" $borderRadius="0.75rem" />
    </SkeletonContainer>
  );
};

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SkeletonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SkeletonBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1.901px solid var(--base-bright-grey);
  border-radius: 0.75rem;
`;
