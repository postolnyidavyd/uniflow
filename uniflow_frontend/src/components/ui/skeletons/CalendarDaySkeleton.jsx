import styled from 'styled-components';
import { SkeletonLine, skeletonPulse } from './SkeletonBase.jsx';

export const CalendarDaySkeleton = () => {
  return (
    <SkeletonDayCell>
      <DateBadgePlaceholder />
      <SkeletonLine $width="90%" $height="1.25rem" />
      <SkeletonLine $width="70%" $height="1.25rem" />
    </SkeletonDayCell>
  );
};

const SkeletonDayCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1.901px solid var(--base-bright-grey, #e7eef3);
  height: 100%;
  width: 100%;
  background: var(--base-white, #fff);
`;

const DateBadgePlaceholder = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  background: var(--base-bright-grey);
  border-radius: 0.25rem;
  margin-bottom: 0.25rem;
  animation: ${skeletonPulse} 1.5s infinite ease-in-out;
`;
