import styled from 'styled-components';
import ProfilePicture from '../ui/ProfilePicture.jsx';
import Spinner from '../ui/Spinner.jsx';
import TriangleWarningIcon from '../../assets/Triangle_Warning.svg?react';

// "Петренко І." → "ПІ", "Петренко Іван" → "ПІ"
const getInitials = (username = '') => {
  const parts = username.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0] ?? '')
    .join('')
    .toUpperCase();
};

// Розрахунок орієнтовного часу від зараз + позиція * середній час
const getEstimatedTime = (positionIndex, avgMinutes) => {
  if (!avgMinutes) return null;
  const ms = positionIndex * avgMinutes * 60 * 1000;
  return new Date(Date.now() + ms).toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const QueueEntriesList = ({
  entries,
  userEntry,
  isEntriesLoading,
  session,
}) => {
  if (isEntriesLoading) return <Spinner />;

  const inProgressEntry = entries.find((e) => e.entryStatus === 'InProgress');
  const waitingEntries = entries.filter((e) => e.entryStatus === 'Waiting');

  return (
    <EntriesContainer>
      <EntriesHeader>
        <h2>Список учасників</h2>

        <h5>Гарантованих місць: {session.guaranteedSlots}</h5>
        <h5>У черзі: {entries.length}</h5>
      </EntriesHeader>

      {inProgressEntry && (
        <InProgressBox>
          <InProgressLabel>Зараз захищає:</InProgressLabel>
          <UserRow>
            <ProfilePicture
              size="md"
              initials={getInitials(inProgressEntry.username)}
            />
            <InProgressName>{inProgressEntry.username}</InProgressName>
          </UserRow>
        </InProgressBox>
      )}

      <EntriesList>
        {waitingEntries.length === 0 && !inProgressEntry ? (
          <EmptyText>Черга поки порожня</EmptyText>
        ) : (
          waitingEntries.map((entry, index) => {
            const globalIndex = entries.findIndex((e) => e.id === entry.id);
            const isGuaranteed = entry.weight > 10;
            const isCurrentUser = entry.id === userEntry?.id;

            // Показуємо розділювач перед першим негарантованим записом
            const showLimitDivider =
              index > 0 &&
              !isGuaranteed &&
              waitingEntries[index - 1].weight > 10;

            const estimatedTime = getEstimatedTime(
              index,
              session.averageMinutesPerStudent
            );

            return (
              <EntryWrapper key={entry.id}>
                {showLimitDivider && (
                  <LimitDivider>
                    <DividerLine />
                    <LimitBadge>
                      <TriangleWarningIcon width={20} height={20} />
                      Межа гарантованого часу
                    </LimitBadge>
                    <DividerLine />
                  </LimitDivider>
                )}

                <EntryItem $isCurrentUser={isCurrentUser}>
                  <ItemLeft>
                    <StatusBar
                      $color={
                        isGuaranteed
                          ? 'var(--malachite-100)'
                          : 'var(--gorse-100)'
                      }
                    />
                    <EntryIndex>{globalIndex + 1}</EntryIndex>
                    <ProfilePicture
                      size="sm"
                      initials={getInitials(entry.username)}
                    />
                    <EntryName>{entry.username}</EntryName>
                    {isCurrentUser && <MeBadge>Ви</MeBadge>}
                    {entry.entryType === 'Secondary' && (
                      <SecondaryLabel>2-га робота</SecondaryLabel>
                    )}
                  </ItemLeft>

                  {estimatedTime && <TimeText>~{estimatedTime}</TimeText>}
                </EntryItem>
              </EntryWrapper>
            );
          })
        )}
      </EntriesList>
    </EntriesContainer>
  );
};

const EntriesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const EntriesHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  h2 {
    font-size: 2.375rem;
    font-weight: 400;
    line-height: 2.5rem;
    margin: 0;
  }
  h5 {
    font-size: 1.25rem;
    font-weight: 400;
    line-height: 1.5rem;
    letter-spacing: -0.025rem;
  }
`;
const InProgressBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  border: 2.5px solid var(--malachite-100);
  background: var(--malachite-20);
  width: 100%;
`;

const InProgressLabel = styled.span`
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 1.75rem;
  letter-spacing: -0.00719rem;
  color: var(--base-black);
`;

const UserRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

const InProgressName = styled.span`
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.5rem;
  letter-spacing: -0.025rem;
`;

const EntriesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const EntryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
`;

const EntryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0.75rem;
  border: 1.901px solid
    ${({ $isCurrentUser }) =>
      $isCurrentUser ? 'var(--accent-color)' : 'var(--base-bright-grey)'};
  background: ${({ $isCurrentUser }) =>
    $isCurrentUser
      ? 'color-mix(in srgb, var(--accent-color) 5%, transparent)'
      : 'var(--base-white)'};
  overflow: hidden;
  width: 100%;
`;

const ItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const StatusBar = styled.div`
  width: 0.5rem;
  align-self: stretch;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const EntryIndex = styled.span`
  font-size: var(--desktop-headings-h4);
  font-weight: 400;
  color: var(--base-black);
  min-width: 1.5rem;
  text-align: center;
`;

const EntryName = styled.span`
  font-size: var(--desktop-headings-h5);
  font-weight: 400;
  color: var(--base-black);
  padding: 0.75rem 0;
`;

const MeBadge = styled.div`
  padding: 0.125rem 0.5rem;
  background: var(--accent-color);
  color: var(--base-white);
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 400;
`;

const SecondaryLabel = styled.span`
  font-size: var(--desktop-headings-h8);
  font-weight: 400;
  color: var(--base-secondary-text);
`;

const TimeText = styled.span`
  font-size: var(--desktop-headings-h5);
  font-weight: 400;
  color: var(--base-secondary-text);
  margin-right: 1rem;
  flex-shrink: 0;
`;

const LimitDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  margin: 0.75rem 0;
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1.5px;
  background: var(--gorse-100);
  opacity: 0.5;
`;

const LimitBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  background: var(--gorse-40);
  font-size: var(--desktop-headings-h8);
  font-weight: 400;
  color: var(--base-black);
  white-space: nowrap;

  svg {
    flex-shrink: 0;
    color: var(--gorse-100);
  }
`;

const EmptyText = styled.p`
  font-size: var(--desktop-headings-h5);
  font-weight: 400;
  color: var(--base-secondary-text);
  text-align: center;
  padding: 2rem 0;
`;

export default QueueEntriesList;
