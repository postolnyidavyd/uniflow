import styled from 'styled-components';
import Radio from './Radio.jsx';

const RadioGroup = ({ label, name, options = [], value, onChange, className }) => {
  return (
    <GroupWrapper className={className}>
      {label && <GroupLabel>{label}</GroupLabel>}
      <OptionsWrapper>
        {options.map((option) => (
          <Radio
            key={option.value}
            label={option.label}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            size={option.size}
            disabled={option.disabled}
          />
        ))}
      </OptionsWrapper>
    </GroupWrapper>
  );
};

const GroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const GroupLabel = styled.span`
  font-family: 'e-Ukraine', sans-serif;
  font-size: var(--desktop-headings-h8);
  font-weight: 400;
  color: var(--base-black);
`;

const OptionsWrapper = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

export default RadioGroup;
