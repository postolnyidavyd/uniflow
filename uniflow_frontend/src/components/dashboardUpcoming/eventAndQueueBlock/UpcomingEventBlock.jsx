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
import { useDispatch } from 'react-redux';
import { openEventDetailModal } from '../../../store/uiSlice.js';

const UpcomingEventBlock = ({
  id,
  focus = false,
  date,
  shortTitle,
  subjectName,
  eventType = 'Deadline',
}) => {
  const dispatch = useDispatch();
  const d = date instanceof Date ? date : new Date(date);

  const day = String(d.getDate()).padStart(2, '0');
  const month = shortMonthNames[d.getMonth()];
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

  const color = eventColors[eventType] ?? eventColors.Deadline;

  const handleClick = ()=> dispatch(openEventDetailModal(id));
  return (
    <Wrapper $focus={focus} $color={color} onClick={handleClick}>
      <Time $focus={focus} $color={color}>
        <DateText>{day}</DateText>
        <MonthText>{month}</MonthText>
      </Time>
      <Info>
        <Title $focus={focus}>
          {subjectName} - {shortTitle}
        </Title>
        <AdditionalInfoText $focus={focus}>{time}</AdditionalInfoText>
      </Info>
    </Wrapper>
  );
};

export default UpcomingEventBlock;
