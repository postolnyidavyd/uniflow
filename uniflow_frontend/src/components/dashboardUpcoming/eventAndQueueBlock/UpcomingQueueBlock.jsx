import { MonthNames } from '../../../utils/monthNames.jsx';
import {
  DateText,
  eventColors,
  Info,
  MonthText,
  Time,
  AdditionalInfoText,
  Title,
  Wrapper,
} from './UpcomingBlockShared.jsx';
import styled from 'styled-components';
import QueueStatusBadge from '../../ui/QueueStatusBadge.jsx';

const UpcomingQueueBlock = ({
  shortTitle,
  subjectName,
  entriesCount,
  userPosition,
  queueStatus,
  queueStartTime,
}) => {
  const d =
    queueStartTime instanceof Date ? queueStartTime : new Date(queueStartTime);

  const day = String(d.getDate()).padStart(2, '0');
  const month = MonthNames[d.getMonth()].toLowerCase();
  
  const color = eventColors.Queue;
  const additionalInfo = userPosition
    ? `Ваша позиція: ${userPosition}`
    : `В черзі: ${entriesCount} людей`;
  return (
    <QueueWrapper $color={color}>
      <LeftSide>
        <Time $color={color}>
          <DateText>{day}</DateText>
          <MonthText>{month}</MonthText>
        </Time>
        <Info>
          <Title>
            {subjectName} - {shortTitle}
          </Title>
          <AdditionalInfoText>{additionalInfo}</AdditionalInfoText>
        </Info>
      </LeftSide>
        <QueueStatusBadge status={queueStatus} size="sm" />
    </QueueWrapper>
  );
};
const QueueWrapper = styled(Wrapper)`
  justify-content: space-between;
  align-items: center;
`;

const LeftSide = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  align-self: stretch;
`;
export default UpcomingQueueBlock;
