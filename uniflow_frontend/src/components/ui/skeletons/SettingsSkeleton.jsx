import styled from 'styled-components';
import { SkeletonLine, SkeletonCircle, skeletonPulse } from './SkeletonBase.jsx';

export const SettingsSkeleton = () => {
  return (
    <SkeletonPageWrapper>
      {/* H1 Title */}
      <SkeletonLine $width="20rem" $height="3.75rem" />

      {/* Profile Card */}
      <SkeletonContentCard>
        <SkeletonLine $width="12rem" $height="2rem" />
        <SkeletonProfileRow>
          <SkeletonCircle $size="8rem" />
          <SkeletonInputGrid>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <SkeletonLine $width="4rem" $height="1rem" style={{ marginBottom: '0.5rem' }} />
                <SkeletonLine $width="100%" $height="3rem" $borderRadius="0.75rem" />
              </div>
            ))}
          </SkeletonInputGrid>
        </SkeletonProfileRow>
        <SkeletonLine $width="10rem" $height="2.5rem" $borderRadius="0.75rem" />
      </SkeletonContentCard>

      {/* Calendar Card */}
      <SkeletonContentCard>
        <SkeletonLine $width="10rem" $height="2rem" />
        
        <SkeletonSection>
          <SkeletonLine $width="15rem" $height="1.5rem" />
          <SkeletonLine $width="100%" $height="1rem" />
          <SkeletonLine $width="90%" $height="1rem" />
          <SkeletonLinkPlaceholder />
        </SkeletonSection>

        <SkeletonSection>
          <SkeletonLine $width="10rem" $height="1.5rem" />
          <SkeletonTogglePlaceholder />
          <SkeletonTogglePlaceholder />
        </SkeletonSection>
      </SkeletonContentCard>

      {/* Logout Button */}
      <SkeletonLine $width="100%" $height="3.5rem" $borderRadius="0.75rem" />
    </SkeletonPageWrapper>
  );
};

const SkeletonPageWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 1rem 0.5rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625rem;
`;

const SkeletonContentCard = styled.div`
  display: flex;
  padding: 1rem 0.75rem;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 1.5rem;
  border-radius: 1.25rem;
  border: 1.901px solid var(--base-bright-grey);
`;

const SkeletonProfileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
`;

const SkeletonInputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  flex: 1;
`;

const SkeletonSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

const SkeletonLinkPlaceholder = styled.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
  
  &::before {
    content: '';
    flex: 1;
    height: 2.5rem;
    background: var(--base-bright-grey);
    border-radius: 1.25rem;
    animation: ${skeletonPulse} 1.5s infinite ease-in-out;
  }
  &::after {
    content: '';
    width: 8rem;
    height: 2.5rem;
    background: var(--base-bright-grey);
    border-radius: 1.25rem;
    animation: ${skeletonPulse} 1.5s infinite ease-in-out;
  }
`;

const SkeletonTogglePlaceholder = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  
  &::before {
    content: '';
    width: 3rem;
    height: 1.5rem;
    background: var(--base-bright-grey);
    border-radius: 1rem;
    animation: ${skeletonPulse} 1.5s infinite ease-in-out;
  }
  &::after {
    content: '';
    flex: 1;
    max-width: 20rem;
    height: 1rem;
    background: var(--base-bright-grey);
    border-radius: 0.5rem;
    animation: ${skeletonPulse} 1.5s infinite ease-in-out;
  }
`;
