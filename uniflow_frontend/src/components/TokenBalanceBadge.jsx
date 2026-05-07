import styled from 'styled-components';
import LightningFilled from '../assets/lightning_fill.svg?react';
const TokenBalanceBadge = ({ balance }) => {
  return (
    <TokenBalanceContainer>
      {balance}
      <LightningFilled width={'1.5rem'} height={'1.5rem'} color={'inherit'} />
    </TokenBalanceContainer>
  );
};
const TokenBalanceContainer = styled.div`
  display: flex;
  height: 2.5rem;
  padding-left: 0.25rem;
  justify-content: center;
  align-items: center;
  gap: 0;
  flex: 1 0 0;
  aspect-ratio: 1/1;
  color: var(--base-white);
  background-color: var(--base-black);
  border-radius: 0.5rem;
`;
export default TokenBalanceBadge;
