import styled from 'styled-components';
import { UpcomingWrapper} from '../../dashboardUpcoming/UpcomingSharedComponents.jsx';
import { UpcomingBlockSkeleton } from './UpcomingBlockSkeleton.jsx';
import { SkeletonLine } from './SkeletonBase.jsx';

export const UpcomingSectionSkeleton = () => {
  return (
    <UpcomingWrapper>
      <HeaderSkeleton>
        <SkeletonLine $width="8rem" $height="1.2rem" />
      </HeaderSkeleton>
      <UpcomingBlockSkeleton />
      <UpcomingBlockSkeleton />
    </UpcomingWrapper>
  );
};

const HeaderSkeleton = styled.div`
  padding: 0.125rem 0;
  margin-bottom: 0.25rem;
`;
