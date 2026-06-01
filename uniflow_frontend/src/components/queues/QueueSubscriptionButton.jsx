import styled from 'styled-components';
import {
  useToggleQueueSubscriptionMutation,
  useGetCalendarSettingsQuery,
} from '../../store/api/subscriptionApi.js';
import Button from '../ui/Button.jsx';
import BellIcon from '../../assets/BellSmall.svg?react';
import { toast } from '../../utils/toast.js';

const QueueSubscriptionButton = ({
  sessionId,
  isSubscribed,
  sessionTitle,
  size = 'md',
  fullWidth = false,
}) => {
  const [toggleSubscription, { isLoading }] =
    useToggleQueueSubscriptionMutation();
  const { data: settings } = useGetCalendarSettingsQuery();

  const isAuto = settings?.autoAddQueues;

  const handleSubscription = async (e) => {
    e.stopPropagation();
    if (!sessionId || isLoading) return;
    try {
      await toggleSubscription(sessionId).unwrap();
      toast.success(
        isSubscribed
          ? `Підписку на ${sessionTitle} скасовано`
          : `Ви підписалися на ${sessionTitle}`
      );
    } catch {
      toast.error('Не вдалося оновити статус підписки');
    }
  };

  if (isAuto) {
    return (
      <AutoAddLabel
        title={`Через налаштування "Автоматично додавати всі черги"`}
      >
        <BellIcon width={18} height={18} />
        Додається автоматично
      </AutoAddLabel>
    );
  }

  return (
    <Button
      fullWidth={fullWidth}
      variant="secondary"
      size={size}
      onClick={handleSubscription}
      isLoading={isLoading}
      disabled={isLoading}
    >
      <BellIcon width="1.25rem" height="1.25rem" />
      {isSubscribed ? 'Скасувати підписку' : 'Підписатися'}
    </Button>
  );
};

const AutoAddLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  border: 2px solid var(--base-bright-grey, #e7eef3);
  font-family: 'e-Ukraine', sans-serif;
  font-size: var(--desktop-headings-h8);
  color: var(--base-black);
  box-sizing: border-box;
`;

export default QueueSubscriptionButton;
