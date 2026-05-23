import styled from 'styled-components';
import { SkeletonLine } from './SkeletonBase.jsx';

export const TokenBalanceSkeleton = () => {
  return (
    <SkeletonBadgeContainer>
      <SkeletonLine $variant="light" $width="2.25rem" $height="2.25rem" $borderRadius="0.5rem" />
    </SkeletonBadgeContainer>
  );
};

const SkeletonBadgeContainer = styled.div`
  display: flex;
  height: 2.5rem;
  width: 2.5rem;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;
