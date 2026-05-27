import styled from 'styled-components';
import { useCountdown } from '../../hooks/useCountdown.js';
import CalendarIcon from '../../assets/Calendar.svg?react';
import { formatDateModal } from '../../utils/ISODateParser.js';

const RegistrationStartCountdown = ({ registrationStartTime }) => {
  const countdown = useCountdown(registrationStartTime);

  return (
    <CountdownBox>
      <h3>Запис відкриється через:</h3>
      {countdown ? (
        <TimeDisplay>
          <span>{countdown.hours}</span>:<span>{countdown.minutes}</span>:
          <span>{countdown.seconds}</span>
        </TimeDisplay>
      ) : (
        <TimeDisplay>Завантаження...</TimeDisplay>
      )}

      <RegistrationTime>
        <CalendarIcon width={32} height={32} />
        <span>{formatDateModal(registrationStartTime)}</span>
      </RegistrationTime>
    </CountdownBox>
  );
};

const CountdownBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  border-radius: 1.25rem;
  border: 1.901px solid var(--base-bright-grey);
  background: var(--base-white);
  align-self: center;
  width: 100%;
  max-width: 600px;
  margin-top: 2rem;

  h3 {
    font-size: var(--desktop-headings-h3);
    font-weight: 400;
    line-height: 2rem;
    letter-spacing: -0.035rem;
    margin: 0;
  }
`;

const TimeDisplay = styled.div`
  font-size: var(--desktop-headings-h2);
  font-weight: 400;
  line-height: 2.5rem;
  letter-spacing: -0.05rem;
  display: flex;
  gap: 0.5rem;

  span {
    min-width: 3.5rem;
    text-align: center;
  }
`;

const RegistrationTime = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--desktop-headings-h5);
  font-weight: 400;
  line-height: 1.5rem;
  letter-spacing: -0.025rem;
  color: var(--base-black);
`;

export default RegistrationStartCountdown;
