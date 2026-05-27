import { shortMonthNames } from '../../../utils/monthNames.js';
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
import { useDispatch } from 'react-redux';
import { openQueueDetailModal } from '../../../store/uiSlice.js';

const UpcomingQueueBlock = ({
  id,
  shortTitle,
  subjectName,
  entriesCount,
  userPosition,
  queueStatus,
  queueStartTime,
}) => {
  const dispatch = useDispatch();
  const d =
    queueStartTime instanceof Date ? queueStartTime : new Date(queueStartTime);

  const day = String(d.getDate()).padStart(2, '0');
  const month = shortMonthNames[d.getMonth()].toLowerCase();

  const color = eventColors.Queue;
  const additionalInfo = userPosition
    ? `Ваша позиція: ${userPosition}`
    : `В черзі: ${entriesCount} людей`;

  const handleClick = () => dispatch(openQueueDetailModal(id));
  return (
    <QueueWrapper $color={color} onClick={handleClick}>
      <LeftSide>
        <QueueTime $color={color}>
          <DateText>{day}</DateText>
          <MonthText>{month}</MonthText>
        </QueueTime>
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
const QueueTime = styled(Time)`
  color: var(--base-black);
`;
export default UpcomingQueueBlock;
