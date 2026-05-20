import styled from 'styled-components';
import InfoIcon from '../assets/Info.svg?react'; // заміни на свій SVG

const HINTS = {
  Split: {
    title: 'Режим здачі: Окремо',
    description: 'Друга робота буде додана окремим записом',
  },
  Batch: {
    title: 'Режим здачі: Разом',
    description: 'Студент здає всі роботи одним блоком підряд',
  },
};

const SubmissionModeHint = ({ mode }) => {
  const hint = HINTS[mode];
  if (!hint) return null;

  return (
    <HintBox>
      <HintTitle>
        <InfoIcon width="1.5rem" height="1.5rem" />
        {hint.title}
      </HintTitle>
      <HintDescription>{hint.description}</HintDescription>
    </HintBox>
  );
};

const HintBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 0.5rem;
  align-items: flex-start;
  align-self: stretch;
  background-color: var(--gorse-40, #fff0b7);


  color: var(--base-black, #000);
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5rem; /* 150% */
  letter-spacing: -0.02rem;
`;

const HintTitle = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

const HintDescription = styled.p`
`;

export default SubmissionModeHint;
