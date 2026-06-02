import styled from 'styled-components';
import ProfilePicture from '../ui/ProfilePicture.jsx';
import TriangleWarningIcon from '../../assets/Triangle_Warning.svg?react';
import { useTimer } from '../../hooks/useTimer.js';
import EmptyState from '../ui/EmptyState.jsx';
import UserAddIcon from '../../assets/User_Add.svg?react';
import LightningIcon from '../../assets/lightning_fill.svg?react';

import { useSelector } from 'react-redux';
import { selectIsHeadman } from '../../store/selectors/authSelector.js';
import { 
  useSkipCurrentEntryMutation, 
  useForceCompleteEntryMutation 
} from '../../store/api/queueApi.js';
import SectionSeparator from '../ui/SectionSeparator.jsx';
import Button from '../ui/Button.jsx';
import { toast } from '../../utils/toast.js';

import { QueueEntryItemSkeleton } from '../ui/skeletons/QueueEntryItemSkeleton.jsx';
import { motion, AnimatePresence } from 'framer-motion';

// "Петренко І." → "ПІ"
const getInitials = (username = '') => {
  const parts = username.trim().split(/\s+/);
  return parts.slice(0, 2).map((p) => p[0] ?? '').join('').toUpperCase();
};

const PriorityIcon = ({ className }) => (
  <IconWrapper className={className} title="Пріоритетний запис">
    <LightningIcon width={28} height={28} />
  </IconWrapper>
);

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFDB4D; /* Gorse/100 */
  cursor: help;

  svg {
    flex-shrink: 0;
  }
`;
const getEstimatedTime = (positionIndex, avgMinutes, sessionStatus, queueStartTime, someoneInProgress) => {
  if (!avgMinutes) return null;
  const baseTime = sessionStatus === 'Active'
    ? Date.now()
    : new Date(queueStartTime).getTime();
  const offset = someoneInProgress ? positionIndex + 1 : positionIndex;
  const ms = offset * avgMinutes * 60 * 1000;
  return new Date(baseTime + ms).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
};

const entryVariants = {
  initial: { opacity: 0, x: 24, scale: 0.98 },
  animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit:    { opacity: 0, x: -24, scale: 0.97, transition: { duration: 0.2, ease: 'easeIn' } },
};

const inProgressVariants = {
  initial: { opacity: 0, y: -12, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit:    { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.2 } },
};

const dividerVariants = {
  initial: { opacity: 0, scaleX: 0.8 },
  animate: { opacity: 1, scaleX: 1, transition: { duration: 0.3 } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
};

const InProgressEntryBox = ({ entry, sessionId }) => {
  const timerValue = useTimer(true);
  const isHeadman = useSelector(selectIsHeadman);
  
  const [skipCurrent, { isLoading: isSkipping }] = useSkipCurrentEntryMutation();
  const [forceComplete, { isLoading: isCompleting }] = useForceCompleteEntryMutation();

  const handleSkip = async () => {
    try {
      await skipCurrent(sessionId).unwrap();
      toast.success('Студента пропущено');
    } catch {
      toast.error('Не вдалося пропустити студента');
    }
  };

  const handleForceComplete = async () => {
    try {
      await forceComplete(sessionId).unwrap();
      toast.success('Здачу завершено примусово');
    } catch {
      toast.error('Не вдалося завершити здачу');
    }
  };

  return (
    <InProgressBox>
      <InProgressTop>
        <InProgressInfo>
          <InProgressLabel>Зараз захищає:</InProgressLabel>
          <UserRow>
            <ProfilePicture size="md" initials={getInitials(entry.username)} />
            <InProgressName>{entry.username}</InProgressName>
          </UserRow>
        </InProgressInfo>
        <TimerText>{timerValue}</TimerText>
      </InProgressTop>
      
      {isHeadman && (
        <HeadmanSection>
          <SectionSeparator size="sm" label="Керування" />
          <HeadmanActions>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleSkip}
              isLoading={isSkipping}
              disabled={isSkipping || isCompleting}
            >
              Пропустити
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              onClick={handleForceComplete}
              isLoading={isCompleting}
              disabled={isCompleting || isSkipping}
            >
              Завершити примусово
            </Button>
          </HeadmanActions>
        </HeadmanSection>
      )}
    </InProgressBox>
  );
};

const QueueEntriesList = ({ entries, userEntry, isEntriesLoading, session }) => {
  const inProgressEntry = entries.find((e) => e.entryStatus === 'InProgress');
  const waitingEntries = entries.filter((e) => e.entryStatus === 'Waiting');

  return (
    <EntriesContainer>
      <EntriesHeader>
        <h2>Список учасників</h2>
        <h5>Гарантованих місць: {session.guaranteedSlots}</h5>
        <h5>У черзі: {entries?.length || 0} людей</h5>
      </EntriesHeader>

      {isEntriesLoading ? (
        <EntriesList>
          {Array.from({ length: 5 }).map((_, i) => (
            <QueueEntryItemSkeleton key={i} />
          ))}
        </EntriesList>
      ) : (
        <>
          <AnimatePresence mode="popLayout">
            {inProgressEntry && (
              <motion.div
                key={inProgressEntry.id}
                variants={inProgressVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                layout
              >
                <InProgressEntryBox entry={inProgressEntry} sessionId={session.id} />
              </motion.div>
            )}
          </AnimatePresence>

          <EntriesList>
            {waitingEntries.length === 0 && !inProgressEntry ? (
              <EmptyState
                variant="medium"
                icon={UserAddIcon}
                title="Ніхто не прийшов"
                description="Наразі ніхто не стоїть в черзі. Можете стати першим."
              />
            ) : (
              <AnimatePresence mode="popLayout">
                {waitingEntries.flatMap((entry, index) => {
                  const globalIndex = entries.findIndex((e) => e.id === entry.id);
                  const isGuaranteed = globalIndex < session.guaranteedSlots;
                  const isCurrentUser = entry.id === userEntry?.id;
                  const showLimitDivider = globalIndex === session.guaranteedSlots;

                  const estimatedTime = getEstimatedTime(
                    index,
                    session.averageMinutesPerStudent,
                    session.queueStatus,
                    session.queueStartTime,
                    !!inProgressEntry
                  );

                  const items = [];

                  if (showLimitDivider) {
                    items.push(
                      <motion.div
                        key="limit-divider"
                        variants={dividerVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        layout
                      >
                        <LimitDivider>
                          <DividerLine />
                          <LimitBadge>
                            <TriangleWarningIcon width={24} height={24} />
                            Межа гарантованого часу
                          </LimitBadge>
                          <DividerLine />
                        </LimitDivider>
                      </motion.div>
                    );
                  }

                  items.push(
                    <motion.div
                      key={entry.id}
                      layout
                      variants={entryVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      style={{ width: '100%' }}
                    >
                      <EntryItem $isCurrentUser={isCurrentUser}>
                        <ItemLeft>
                          <StatusBar $color={isGuaranteed ? 'var(--malachite-100)' : 'var(--gorse-100)'} />
                          <EntryIndex>{globalIndex + 1}</EntryIndex>
                          <ProfilePicture size="sm" initials={getInitials(entry.username)} />
                          <EntryNameWrapper>
                            <EntryName>{entry.username}</EntryName>
                            {entry.usedToken && entry.entryType !== 'Secondary' && <PriorityIcon />}
                          </EntryNameWrapper>
                          {isCurrentUser && <MeBadge>Ви</MeBadge>}
                          {entry.entryType === 'Secondary' && (
                            <SecondaryLabel>2-га робота</SecondaryLabel>
                          )}
                        </ItemLeft>
                        {estimatedTime && <TimeText>{estimatedTime}</TimeText>}
                      </EntryItem>
                    </motion.div>
                  );

                  return items;
                })}
              </AnimatePresence>
            )}
          </EntriesList>
        </>
      )}
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
  gap: 1rem;
  align-self: stretch;
  h2 { font-size: var(--desktop-headings-h2); font-weight: 400; line-height: 2.5rem; margin: 0; }
  h5 { font-size: var(--desktop-headings-h5); font-weight: 400; line-height: 1.5rem; letter-spacing: -0.025rem; margin: 0; }
`;

const InProgressBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem 1.5rem;
  border-radius: 0.625rem;
  border: 2.5px solid var(--malachite-100);
  background: var(--base-white);
  width: 100%;
`;

const InProgressTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const HeadmanSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 0.5rem;
`;

const HeadmanActions = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  margin-top: 0.5rem;
  
  & > button {
    flex: 1;
    font-size: 0.875rem;
    height: 2.5rem;
  }
`;

const InProgressInfo = styled.div`display: flex; flex-direction: column; gap: 0.5rem;`;
const InProgressLabel = styled.span`font-size: var(--desktop-headings-h4); font-weight: 400; color: var(--base-black);`;
const UserRow = styled.div`display: flex; align-items: center; gap: 0.625rem;`;
const InProgressName = styled.span`font-size: var(--desktop-headings-h5); font-weight: 400; color: var(--base-black);`;
const TimerText = styled.span`font-size: var(--desktop-headings-h4); font-weight: 400; color: var(--base-black);`;

const EntriesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  border-radius: 0.625rem;
  border: 1px solid var(--base-bright-grey);
  background: ${({ $isCurrentUser }) => $isCurrentUser ? 'rgba(100, 128, 109, 0.05)' : 'var(--base-white)'};
  overflow: hidden;
  width: 100%;
`;

const ItemLeft = styled.div`display: flex; align-items: center; gap: 1rem; height: 100%;`;

const EntryNameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

const StatusBar = styled.div`
  width: 1rem;
  height: 3rem;
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
`;

const MeBadge = styled.div`
  padding: 0.25rem 0.5rem;
  background: var(--malachite-100);
  color: var(--base-white);
  border-radius: 0.5rem;
  font-size: var(--desktop-headings-h9);
  font-weight: 400;
`;

const SecondaryLabel = styled.span`
  font-size: var(--desktop-headings-h6);
  font-weight: 400;
  color: var(--base-black);
  opacity: 0.6;
`;

const TimeText = styled.span`
  font-size: var(--desktop-headings-h4);
  font-weight: 400;
  color: var(--base-black);
  margin-right: 1rem;
  flex-shrink: 0;
`;

const LimitDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  margin: 1rem 0;
`;

const DividerLine = styled.div`
  height: 0.125rem;
  flex: 1 0 0;
  background-image: linear-gradient(to right, var(--base-black, #000) 60%, rgba(255,255,255,0) 0%);
  background-position: center;
  background-size: 20px 0.125rem;
  background-repeat: repeat-x;
`;

const LimitBadge = styled.div`
  display: flex;
  padding: 0.25rem 0.5rem;
  align-items: center;
  gap: 0.625rem;
  border-radius: 0.5rem;
  background: #fff0b7;
  font-size: 1.5rem;
  font-family: 'e-Ukraine', sans-serif;
  font-weight: 400;
  line-height: 1.75rem;
  color: var(--base-black);
  white-space: nowrap;
  letter-spacing: -0.0072rem;
  svg { flex-shrink: 0; width: 24px; height: 24px; }
`;

export default QueueEntriesList;