import styled from 'styled-components';
import ProfilePicture from '../components/ui/ProfilePicture.jsx';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/selectors/authSelector.js';
import Input from '../components/ui/inputs/Input.jsx';
import Button from '../components/ui/Button.jsx';
import {
  useGetCalendarSettingsQuery,
  useToggleAutoAddEventsMutation,
  useToggleAutoAddQueuesMutation,
} from '../store/api/subscriptionApi.js';
import CopyIcon from '../assets/CopyBig.svg?react';
import ExitIcon from '../assets/Exit.svg?react';
import Toggle from '../components/ui/Toggle.jsx';
import { toast } from '../utils/toast.js';
import { useLogoutMutation } from '../store/api/authApi.js';
import { useNavigate } from 'react-router-dom';
import { SettingsSkeleton } from '../components/ui/skeletons/SettingsSkeleton.jsx';

const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;
function SettingsPage() {
  const user = useSelector(selectUser);
  const { data: settings, isLoading } = useGetCalendarSettingsQuery();
  const [toggleAutoAddEvents] = useToggleAutoAddEventsMutation();
  const [toggleAutoAddQueues] = useToggleAutoAddQueuesMutation();
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  if (isLoading || !settings) return <SettingsSkeleton />;

  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`;

  const exportLink = settings.syncToken
    ? `${BASE_URL}/calendar/export/${settings.syncToken}.ics`
    : `...`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportLink);

      toast.success('Посилання скопійовано!');
    } catch {
      toast.error('Помилка при копіюванні');
    }
  };
  const handleToggleEvents = async () => {
    try {
      const isTogglingOn = !settings.autoAddEvents;
      await toggleAutoAddEvents().unwrap();
      toast.success(
        isTogglingOn
          ? 'Додавання всіх подій увімкнено'
          : 'Додавання всіх подій вимкнено'
      );
    } catch {
      toast.error('Помилка при змінні налаштування');
    }
  };
  const handleToggleQueues = async () => {
    try {
      const isTogglingOn = !settings.autoAddQueues;
      await toggleAutoAddQueues().unwrap();
      toast.success(
        isTogglingOn
          ? 'Додавання всіх черг, в яких ви зареєстровані, увімкнено'
          : 'Додавання всіх черг, в яких ви зареєстровані, вимкнено'
      );
    } catch {
      toast.error('Помилка при змінні налаштування');
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate('/landing');
      toast.success('Ви успішно вийшли! Повертайтеся скоріше');
    } catch {
      toast.error('Помилка виходу');
    }
  };
  return (
    <PageWrapper>
      <h1>Налаштування</h1>
      <ContentCard>
        <h3>Мій профіль</h3>
        <ProfileInfoWrapper>
          <ProfilePicture size="lg" initials={initials} />
          <InputGroup>
            <Input disabled label="Ім`я" defaultValue={user.firstName} />
            <Input disabled label="Прізвище" defaultValue={user.lastName} />
            <Input
              disabled
              label="Електронна пошта"
              defaultValue={user.email}
            />
            <Input disabled label="Група" defaultValue={user.group} />
          </InputGroup>
        </ProfileInfoWrapper>
        <Button disabled>Зберегти зміни</Button>
      </ContentCard>
      <ContentCard $gap="2rem">
        <h3>Календар</h3>

        <CalendarSettingsSection>
          <h5>Експорт/синхронізація розкладу</h5>
          <p>
            Отримайте посилання на ваш персональний календар.Додайте його прямо
            в Google Calendar, Apple Calendar або будь-який інший календар з
            підтримкою ICalFeed. Розклад буде автоматично оновлюватися кожні
            4-12 годин
          </p>
          <CalendarLinkSection>
            <CalendarLink>{exportLink}</CalendarLink>
            <Button size="sm" onClick={handleCopy}>
              <CopyIcon />
              Скопіювати
            </Button>
          </CalendarLinkSection>
          <p>
            Щоб подія потрапила в експорт потрібно перейти на неї в календарі і
            вручну додати, або включити відповідну опцію в налаштуваннях
          </p>
        </CalendarSettingsSection>
        <CalendarSettingsSection>
          <h5>Налаштування</h5>
          <Toggle
            checked={settings.autoAddEvents}
            onChange={handleToggleEvents}
            label="Автоматично додавати всі події та дедлайни(без черг)"
          />
          <Toggle
            checked={settings.autoAddQueues}
            onChange={handleToggleQueues}
            label="Автоматично додавати запис про чергу, при приєднанні в неї"
          />
        </CalendarSettingsSection>
      </ContentCard>
      <Button size="lg" variant="secondary" fullWidth onClick={handleLogout}>
        <ExitIcon /> Вийти з акаунту
      </Button>
    </PageWrapper>
  );
}
const CalendarLinkSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 0.25rem;
  svg {
    width: 1.25rem;
    height: 1.25rem;
    aspect-ratio: 1/1;
  }
`;
const CalendarLink = styled.div`
  display: flex;
  padding: 0.5rem 0.75rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;

  border-radius: 1.25rem;
  border: 1.901px solid var(--base-bright-grey, #e7eef3);

  color: var(--base-black, #000);

  font-size: 0.8125rem;
  font-style: normal;
  font-weight: 300;
  line-height: 1.125rem; /* 138.462% */
`;

const CalendarSettingsSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  color: var(--base-black, #000);

  h5 {
    text-align: center;
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.5rem; /* 120% */
    letter-spacing: -0.025rem;
  }
  p {
    font-size: 1rem;
    font-style: normal;
    font-weight: 300;
    line-height: 1.5rem; /* 150% */
    letter-spacing: -0.02rem;
    max-width: 47.25rem;
  }
`;
const InputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
`;
const ProfileInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;
const ContentCard = styled.div`
  display: flex;
  padding: 1rem 0.75rem;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;

  gap: ${({ $gap }) => $gap || '1rem'};

  border-radius: 1.25rem;
  border: 1.901px solid var(--base-bright-grey, #e7eef3);
  h3 {
    color: var(--base-black, #000);
    text-align: center;

    font-size: 1.75rem;
    font-style: normal;
    font-weight: 400;
    line-height: 2rem; /* 114.286% */
    letter-spacing: -0.035rem;
  }
`;
const PageWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 1rem 0.5rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625rem;

  h1 {
    font-size: 3.5rem;
    font-style: normal;
    font-weight: 400;
    line-height: 3.75rem; /* 107.143% */
    letter-spacing: -0.07rem;
  }
`;
export default SettingsPage;
