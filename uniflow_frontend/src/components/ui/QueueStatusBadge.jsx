import styled, { css } from 'styled-components';
import {
  colorStatusFormating,
  queueStatusFormating,
} from '../../utils/queueStatusFormating.js';

const textSizes = {
  sm: 'font-size: var(--desktop-base-small);',
  md: css`
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.5rem; /* 120% */
    letter-spacing: -0.025rem;
  `,
  lg: 'font-size:var(--desktop-headings-h2);',
};
const badgeSizes = {
  sm: css`
    width: 1rem;
    height: 1rem;
  `,
  md: css`
    width: 1.5rem;
    height: 1.5rem;
  `,
  lg: css`
    width: 2.5rem;
    height: 2.5rem;
  `,
};
const QueueStatusBadge = ({ status, size, ...props }) => {
  return (
    <Wrapper {...props} $size={size}>
      <Badge $status={status} $size={size} />
      {queueStatusFormating[status] || status}
    </Wrapper>
  );
};
const Wrapper = styled.div`
  display: inline-flex;
  gap: ${({ $size }) => ($size === 'sm' ? '0.25rem' : '0.5rem')};
  align-items: center;
  justify-content: center;
  ${({ $size }) => textSizes[$size] || textSizes.md};
  color: var(--base-black);
`;
const Badge = styled.div`
  border-radius: 50%;
  background-color: ${({ $status }) =>
    colorStatusFormating[$status] || colorStatusFormating.Planned};
  ${({ $size }) => badgeSizes[$size] || badgeSizes.md};
`;
export default QueueStatusBadge;
