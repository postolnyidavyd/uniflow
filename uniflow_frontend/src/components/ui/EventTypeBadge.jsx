import styled from 'styled-components';
import {
  eventTypeBackgroundColor,
  eventTypeFormating,
} from '../../utils/eventTypeFormating.js';


const StyledBadge = styled.div`
  background-color: ${({ $type }) =>
    eventTypeBackgroundColor[$type] || eventTypeBackgroundColor.Deadline};
  color: var(--base-white);
  padding: 0 0.375rem;
  border-radius: 0.75rem;
  font-family: 'e-Ukraine', sans-serif;
  font-size: 1.125rem;
  font-weight: 400;
  line-height: 28px;
  letter-spacing: -0.36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
`;

const EventTypeBadge = ({ type, className }) => {
  return (
    <StyledBadge $type={type} className={className}>
      {eventTypeFormating[type] || eventTypeFormating.Deadline}
    </StyledBadge>
  );
};

export default EventTypeBadge;
