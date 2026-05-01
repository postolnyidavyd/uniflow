import styled from 'styled-components';
import { forwardRef } from 'react';


const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    width: 100%;
    padding-top: 1.25rem;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const StyledSelect = styled.select`
    width: 100%;
    padding: 0.25rem 24px 0.5rem 0;
    font-size: var(--desktop-base-body);
    color: var(--base-black);
    background-color: transparent;
    border: none;
    border-bottom: 0.125rem solid ${({ $error }) => $error ? 'var(--brick-red-100, #E42939)' : 'var(--base-black)'};
    border-radius: 0;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    cursor: pointer;

    &:focus {
        
        border-bottom-color: ${({ $error }) => $error ? 'var(--brick-red-100, #E42939)' : 'var(--base-black)'};
        box-shadow: 0 1px 0 0 ${({ $error }) => $error ? 'var(--brick-red-100, #E42939)' : 'var(--base-black)'};
    }

    &:disabled {
        border-bottom-color: var(--grey-40);
        color: var(--grey-60);
        cursor: not-allowed;
    }
`;

const StyledLabel = styled.label`
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    font-size: var(--desktop-base-body);
    color: var(--grey-100);
    pointer-events: none;
    transition: all 0.2s ease-out;

    ${StyledSelect}:focus ~ &,
    ${StyledSelect}:has(option:checked:not([value=""])) ~ & {
        top: -4px;
        transform: translateY(-100%);
        font-size: var(--desktop-base-tiny);
        color: var(--grey-100);
    }
`;

const ChevronIcon = styled.svg`
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    width: 20px;
    height: 20px;
    color: var(--base-black);
    transition: transform 0.2s ease;

    ${StyledSelect}:focus ~ & {
        transform: translateY(-50%) rotate(180deg);
    }
`;

const ErrorText = styled.p`
    font-size: 0.8rem;
    color: var(--brick-red-100, #E42939);
    margin: 0;
`;

const Select = forwardRef(({ label, id, error, options = [], onChange, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;

    const handleChange = (e) => {
        e.target.blur();
        if (onChange) {
            onChange(e);
        }
    };

    return (
        <Wrapper>
            <InputContainer>
            <StyledSelect
                id={selectId}
                ref={ref}
                $error={!!error}
                onChange={handleChange}
                {...props}
            >
                <option value="" disabled hidden></option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </StyledSelect>

            <StyledLabel htmlFor={selectId}>{label}</StyledLabel>

            <ChevronIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
            </ChevronIcon>
            </InputContainer>
            {error && <ErrorText>{error}</ErrorText>}
        </Wrapper>
    );
});

Select.displayName = "Select";
export default Select;