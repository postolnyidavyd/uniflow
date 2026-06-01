import styled from 'styled-components';
import LightningFilled from '../assets/lightning_fill.svg?react';
const TokenBalanceBadge = ({ balance }) => {
  return (
    <TokenBalanceContainer>
      <span>{balance}</span>
      <LightningFilled width={'1.25rem'} height={'1.25rem'} color={'inherit'} />
    </TokenBalanceContainer>
  );
};
const TokenBalanceContainer = styled.div`
  display: flex;
  height: 2.5rem;
  padding: 0 0.375rem;
  justify-content: center;
  align-items: center;
  gap: 0.125rem;
  flex-shrink: 0;
  aspect-ratio: 1/1;
  color: var(--base-white);
  background-color: var(--base-black);
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 400;

  span {
    line-height: 1;
  }
`;
export default TokenBalanceBadge;
