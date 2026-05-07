import styled from 'styled-components';

export const UpcomingWrapper = styled.div`
  display: flex;
  min-height: 13.125rem;
  padding: 0.5rem 0.5rem 0.25rem 0.75rem;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1 0 0;        /* горизонталь рівні колонки */
  width: 100%;        /* вертикаль повна ширина */
  border-radius: 1.25rem;
  border: 1.901px solid var(--base-bright-grey);
`;
export const UpcomingHeader = styled.h6`
  color: #000;
  font-size: 1.18788rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.42544rem; /* 120% */
  letter-spacing: -0.02375rem;
`;

export const UpcomingEmptyStateBlock = styled.div`
  font-style: var(--desktop-headings-h7);
  display: flex;
  padding-top: 2rem;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`

