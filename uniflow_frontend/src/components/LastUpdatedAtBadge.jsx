import { getRelativeTimeInfo } from '../utils/ISODateParser.js';
import styled from "styled-components";

export const LastUpdatedAtBadge = ({ lastUpdatedAt }) => {
  const { text, isRecent } = getRelativeTimeInfo(lastUpdatedAt);
  if (!text) return null;

  return (
    <Badge>
      <Dot $isRecent={isRecent} />
      {text}
    </Badge>
  );
};

const Dot = styled.span`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: ${({ $isRecent }) =>
    $isRecent ? 'var(--malachite-100, #04C65D);' : 'var(--base-secondary-text, #6B6B6B);'};
`;


const Badge = styled.div`
  display: flex;
  padding: 0.25rem;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;

  border-radius: 0.25rem;
  background: var(--base-bright-grey, #E7EEF3);

  color: var(--base-secondary-text, #6B6B6B);

    
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem; /* 133.333% */
  letter-spacing: -0.015rem;
`
