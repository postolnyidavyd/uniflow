import styled, { css } from 'styled-components';

export const eventColors = {
    Deadline: 'var(--brick-red-100)',
    Event: 'var(--radiance-100)',
    Queue: 'var(--gorse-100)',
};
export const Wrapper = styled.div`
  border-radius: 0.5rem;
  display: flex;
  width: 100%;
  padding: 0.25rem 0.5rem;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--desktop-headings-h8);

  ${({ $focus, $color }) => $focus ? css`
    border: 2px solid ${$color};
    background: ${$color};
    color: var(--base-white);
  ` : css`
    border: 1.901px solid var(--base-bright-grey);
    background: transparent;
    color: var(--base-black);
  `}
`;

export const Time = styled.div`
  display: flex;
  padding: 0.25rem 0.5625rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.625rem;
  background-color: ${({ $focus, $color }) => $focus ? 'var(--base-white)' : $color};
  color: ${({ $focus, $color }) => $focus ? $color : 'var(--base-white)'};
`;

export const DateText = styled.p`
  font-size: var(--desktop-headings-h9);
  font-weight: 500;
  line-height: 1.2;
`;

export const MonthText = styled.p`
  font-size: 0.625rem;
  font-weight: 300;
  line-height: 1rem;
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const Title = styled.p`
  font-size: var(--desktop-base-small);
  font-weight: 400;
  color: inherit;
`;

export const AdditionalInfoText = styled.p`
  font-size: var(--desktop-base-small);
  font-weight: 300;
  color: inherit;
  opacity: ${({ $focus }) => $focus ? 0.85 : 1};
`;