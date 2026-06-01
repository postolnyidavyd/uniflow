import styled from 'styled-components';
import { useState } from 'react';
import Button from '../../ui/Button.jsx';
import TextButton from '../../ui/TextButton.jsx';
import BellIcon from '../../../assets/BellSmall.svg?react';
import { useGetCalendarSettingsQuery } from '../../../store/api/subscriptionApi.js';

export const AddToCalendarButton = ({
  type,
  isSubscribed,
  onToggle,
  isUserInQueue = false,
}) => {
  const { data: settings } = useGetCalendarSettingsQuery();

  const isAutoEvent = type === 'event' && settings?.autoAddEvents;
  const isAutoQueue =
    type === 'queue' && settings?.autoAddQueues && isUserInQueue;
  const isAuto = isAutoEvent || isAutoQueue;

  if (isAuto) {
    return (
      <AutoAddLabel>
        <BellIcon width={18} height={18} />
        Додається автоматично
      </AutoAddLabel>
    );
  }

  return (
    <Button variant="secondary" fullWidth onClick={onToggle}>
      <BellIcon width={24} height={24} />
      {isSubscribed ? 'Видалити з календаря' : 'Додати в календар'}
    </Button>
  );
};

export const ModalTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  white-space: nowrap;
`;

export const ModalSubjectText = styled.span`
  font-family: 'e-Ukraine', sans-serif;
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 28px;
  letter-spacing: -0.1152px;
  color: var(--base-black, #000000);
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const ModalBigTitle = styled.h2`
  color: var(--base-black, #000000);
  text-align: center;
  //margin: 0;
  font-size: 2.375rem;
  font-style: normal;
  font-weight: 400;
  line-height: 2.5rem; /* 105.263% */
`;

export const ModalDateRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--base-black, #000000);
`;

export const ModalDateText = styled.span`
  font-family: 'e-Ukraine', sans-serif;
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.4px;
`;

export const ModalLinkBox = styled.div`
  display: flex;
  align-items: ${({ $alignTop }) => ($alignTop ? 'flex-start' : 'center')};
  justify-content: space-between;
  padding: 0.5rem;
  border: 2px solid var(--base-bright-grey, #e7eef3);
  border-radius: 0.75rem;
  width: 100%;
  box-sizing: border-box;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  color: inherit;

  ${(props) =>
    props.$clickable &&
    `
    cursor: pointer;
    &:hover {
      border-color: var(--base-primary, #007AFF);
      background-color: #F8FAFC;
    }
  `}
`;

export const ModalLinkLeft = styled.div`
  display: flex;
  align-items: ${({ $alignTop }) => ($alignTop ? 'flex-start' : 'center')};
  gap: 0.5rem;
  overflow: hidden;
  ${({ $alignTop }) => $alignTop && 'padding-top: 0.125rem;'}
`;

export const ModalLinkContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow: hidden;
  flex: 1;
`;

export const ModalLinkLabel = styled.span`
  font-family: 'e-Ukraine', sans-serif;
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.4px;
  color: var(--base-black, #000000);
`;

export const ModalLinkHref = styled.a`
  font-family: 'e-Ukraine', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.32px;
  color: var(--base-secondary-text, #6b6b6b);
  text-decoration: underline;
  text-decoration-skip-ink: none;
  word-break: break-all;
`;

export const ModalLinkValue = styled.span`
  font-family: 'e-Ukraine', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.32px;
  color: var(--base-secondary-text, #6b6b6b);
  word-break: break-word;
`;

export const ExpandableLinkValue = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  // Показуємо кнопку, якщо текст довший за 60 символів
  const shouldShowButton = text.length > 60;

  return (
    <ExpandableContainer>
      <ExpandableContent $isExpanded={isExpanded}>
        {text}
      </ExpandableContent>
      {shouldShowButton && (
        <TextButton
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          style={{
            padding: '0.25rem 0',
            height: 'auto',
            marginTop: '0.25rem',
          }}
        >
          {isExpanded ? 'Згорнути' : 'Розгорнути'}
        </TextButton>
      )}
    </ExpandableContainer>
  );
};

const ExpandableContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const ExpandableContent = styled.div`
  font-family: 'e-Ukraine', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5rem;
  letter-spacing: -0.32px;
  color: var(--base-secondary-text, #6b6b6b);
  word-break: break-word;

  display: ${({ $isExpanded }) => ($isExpanded ? 'block' : '-webkit-box')};
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ModalCountdown = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  font-family: 'e-Ukraine', sans-serif;
  font-size: 3.5rem;
  font-weight: 400;
  line-height: 60px;
  letter-spacing: -1.12px;
  color: var(--base-black, #000000);
`;

export const CountdownSeparator = styled.span`
  color: var(--base-secondary-text, #e7eef3);
`;

export const CountdownSegment = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
`;

export const CountdownLabel = styled.span`
  font-size: 0.875rem;
  line-height: 1rem;
  font-weight: 300;
  color: var(--base-secondary-text);
  margin-top: 0.25rem;
`;

const AutoAddLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  border: 2px solid var(--base-bright-grey, #e7eef3);
  font-family: 'e-Ukraine', sans-serif;
  font-size: 1rem;
  color: var(--base-secondary-text, #6b6b6b);
  width: 100%;
  box-sizing: border-box;
`;

import { SkeletonLine as BaseSkeletonLine } from '../../ui/skeletons/SkeletonBase.jsx';

export const SkeletonLine = BaseSkeletonLine;
