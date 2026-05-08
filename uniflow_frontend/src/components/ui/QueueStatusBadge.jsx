import styled, { css } from 'styled-components';
import {
  colorStatusFormating,
  queueStatusFormating,
} from '../../utils/queueStatusFormating.js';

const textSizes = {
  sm: 'var(--desktop-base-small)',
  md: 'var(--desktop-headings-h5)',
  lg: 'var(--desktop-headings-h2)',
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
      {queueStatusFormating[status] || status}
      <Badge $status={status} $size={size} />
    </Wrapper>
  );
};
const Wrapper = styled.div`
  display: inline-flex;
  gap: ${({ $size }) => ($size === 'sm' ? '0.25rem' : '0.5rem')};
  align-items: center;
  justify-content: center;
  font-style: ${({ $size }) => textSizes[$size] || textSizes.md};
  color: var(--base-black);
`;
const Badge = styled.div`
  border-radius: 50%;
  background-color: ${({ $status }) =>
    colorStatusFormating[$status] || colorStatusFormating.Planned};
  ${({ $size }) => badgeSizes[$size] || badgeSizes.md};
`;
export default QueueStatusBadge;
