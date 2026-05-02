import {MonthNames} from "../../../utils/monthNames.jsx";
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


const UpcomingEventBlock = ({ focus = false, date, shortTitle, subjectName, eventType = 'Deadline' }) => {
    const d = date instanceof Date ? date : new Date(date);

    const day = String(d.getDate()).padStart(2, '0');
    const month = MonthNames[d.getMonth()];
    const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

    const color = eventColors[eventType] ?? eventColors.Deadline;

    return (
        <Wrapper $focus={focus} $color={color}>
            <Time $focus={focus} $color={color}>
                <DateText>{day}</DateText>
                <MonthText>{month}</MonthText>
            </Time>
            <Info>
                <Title $focus={focus}>{subjectName} - {shortTitle}</Title>
                <AdditionalInfoText $focus={focus}>{time}</AdditionalInfoText>
            </Info>
        </Wrapper>
    );
};


export default UpcomingEventBlock;