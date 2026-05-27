import styled from 'styled-components';
import ShieldIcon from '../../assets/ShieldSmall.svg?react';

const SectionSeparator = ({ size = 'sm', label = 'Керування' }) => {
  return (
    <SeparatorWrapper $size={size}>
      <DividerLine />
      <LabelBadge $size={size}>
        <ShieldIcon width={size === 'sm' ? 12 : 24} height={size === 'sm' ? 12 : 24} />
        <span>{label}</span>
      </LabelBadge>
      <DividerLine />
    </SeparatorWrapper>
  );
};

const SeparatorWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: ${({ $size }) => ($size === 'sm' ? '0.75rem 0' : '1.5rem 0')};
`;

const DividerLine = styled.div`
  flex: 1;
  height: 0.125rem;
  background-image: linear-gradient(to right, var(--base-black, #000) 60%, rgba(255, 255, 255, 0) 0%);
  background-position: center;
  background-size: 20px 0.125rem;
  background-repeat: repeat-x;
`;

const LabelBadge = styled.div`
  display: flex;
  padding: ${({ $size }) => ($size === 'sm' ? '0.25rem 0.375rem' : '0.25rem 0.5rem')};
  align-items: center;
  gap: ${({ $size }) => ($size === 'sm' ? '0.25rem' : '0.625rem')};
  border-radius: 0.5rem;
  background: var(--base-bright-grey);
  
  color: var(--base-black);
  font-family: 'e-Ukraine', sans-serif;
  font-weight: 400;
  white-space: nowrap;

  font-size: ${({ $size }) => ($size === 'sm' ? '0.8125rem' : '1.5rem')};
  line-height: ${({ $size }) => ($size === 'sm' ? '1rem' : '1.75rem')};
  letter-spacing: -0.02rem;

  svg {
    flex-shrink: 0;
  }
`;

export default SectionSeparator;
