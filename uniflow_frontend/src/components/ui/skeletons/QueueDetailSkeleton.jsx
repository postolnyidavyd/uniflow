import styled from 'styled-components';
import { SkeletonLine, SkeletonCircle } from './SkeletonBase.jsx';

export const QueueDetailSkeleton = () => {
  return (
    <SkeletonContainer>
      {/* Title */}
      <SkeletonLine $width="80%" $height="2.5rem" />
      
      {/* Header Row (Date + Status) */}
      <SkeletonRow justify="space-between">
        <SkeletonRow>
          <SkeletonCircle $size="1.5rem" />
          <SkeletonLine $width="8rem" $height="1.25rem" />
        </SkeletonRow>
        <SkeletonLine $width="6rem" $height="1.5rem" $borderRadius="2rem" />
      </SkeletonRow>

      {/* Countdown or Position Area */}
      <SkeletonCenterArea>
        <SkeletonLine $width="40%" $height="1rem" />
        <SkeletonLine $width="60%" $height="4rem" />
        <SkeletonLine $width="30%" $height="1rem" />
      </SkeletonCenterArea>

      {/* Buttons */}
      <SkeletonButtons>
        <SkeletonLine $width="100%" $height="3rem" $borderRadius="0.75rem" />
        <SkeletonLine $width="100%" $height="3rem" $borderRadius="0.75rem" />
      </SkeletonButtons>
    </SkeletonContainer>
  );
};

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const SkeletonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: ${props => props.justify || 'flex-start'};
`;

const SkeletonCenterArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 0;
`;

const SkeletonButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;
