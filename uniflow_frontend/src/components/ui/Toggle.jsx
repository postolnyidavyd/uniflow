import styled from 'styled-components';

const ToggleWrapper = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
`;

const HiddenInput = styled.input.attrs({ type: 'checkbox' })`
  display: none;
`;

const Track = styled.div`
  width: 2.75rem;
  height: 1.5rem;
  border-radius: 1.5rem;
  background: ${({ $checked }) => $checked ? 'var(--malachite-100)' : 'var(--base-bright-grey)'};
  position: relative;
  transition: background 0.2s ease;
`;

const Thumb = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background: var(--base-white);
  position: absolute;
  top: 0.125rem;
  left: ${({ $checked }) => $checked ? '1.375rem' : '0.125rem'};
  transition: left 0.2s ease;
  box-shadow: var(--shadow);
`;
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`
const Label = styled.span`
  font-size: var(--desktop-headings-h6);
  color: var(--base-black, #000);
`
// Використання
function Toggle({ checked, label, onChange }) {
  return (
    <Wrapper>
      <ToggleWrapper>
        <HiddenInput checked={checked} onChange={onChange} />
        <Track $checked={checked}>
          <Thumb $checked={checked} />
        </Track>
      </ToggleWrapper>
      {label && <Label>{label}</Label>}
    </Wrapper>

  );
}
export default Toggle;