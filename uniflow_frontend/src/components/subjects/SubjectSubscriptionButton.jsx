import styled from 'styled-components';
import { useToggleSubjectSubscriptionMutation, useGetCalendarSettingsQuery } from '../../store/api/subscriptionApi.js';
import Button from '../ui/Button.jsx';
import BellIcon from '../../assets/BellSmall.svg?react';
import { toast } from '../../utils/toast.js';

const SubjectSubscriptionButton = ({ subjectId, isSubscribed, subjectName }) => {
  const [toggleSubjectSubscription, { isLoading }] = useToggleSubjectSubscriptionMutation();
  const { data: settings } = useGetCalendarSettingsQuery();

  const isAuto = settings?.autoAddEvents; 

  const handleSubscription = async () => {
    if (!subjectId || isLoading) return;
    try {
      await toggleSubjectSubscription(subjectId).unwrap();
      toast.success(
        isSubscribed
          ? `Підписку на ${subjectName} скасовано`
          : `Підписку на ${subjectName} додано`
      );
    } catch {
      toast.error('Не вдалося оновити статус підписки');
    }
  };

  if (isAuto) {
    return (
      <AutoAddLabel title={`Через налаштування "Автоматично додавати всі події"`}>
        <BellIcon width={18} height={18} />
        Додається автоматично
      </AutoAddLabel>
    );
  }

  return (
    <Button 
      fullWidth 
      variant="secondary" 
      onClick={handleSubscription}
      isLoading={isLoading}
      disabled={isLoading}
    >
      <BellIcon width="1.5rem" height="1.5rem" />
      {isSubscribed ? 'Скасувати підписку' : 'Підписатися на предмет'}
    </Button>
  );
};

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
  color: var(--base-black);
  width: 100%;
  box-sizing: border-box;
`;

export default SubjectSubscriptionButton;
