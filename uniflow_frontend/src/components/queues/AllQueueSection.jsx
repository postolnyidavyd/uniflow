import { useState } from 'react';
import styled from 'styled-components';
import { useGetQueuesQuery } from '../../store/api/queueApi.js';
import { useGetSubjectsShortQuery } from '../../store/api/subjectApi.js';
import SubjectFilterChips from './SubjectFilterChips.jsx';
import QueueCard from './QueueCard.jsx';
import { QueueCardSkeleton } from '../ui/skeletons/QueueCardSkeleton.jsx';
import Pagination from '../ui/Pagination.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import UsersIcon from '../../assets/UsersBig.svg?react';

const PAGE_SIZE = 9;
const AllQueuesSection = () => {
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [page, setPage] = useState(1);

  const { data: subjects } = useGetSubjectsShortQuery();

  const { data: queuesData, isFetching } = useGetQueuesQuery({
    page,
    pageSize: PAGE_SIZE,
    ...(selectedSubjectId ? { subjectId: selectedSubjectId } : {}),
  });

  const handleSubjectSelect = (subjectId) => {
    setSelectedSubjectId(subjectId);
    setPage(1);
  };
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isEmpty =
    !isFetching && (!queuesData?.items || queuesData.items.length === 0);

  return (
    <SectionWrapper>
      <SectionTitle>Всі черги</SectionTitle>

      {/* Ніякого ChipsContainer — SubjectFilterChips сам скролиться */}
      <SubjectFilterChips
        subjects={subjects ?? []}
        selectedId={selectedSubjectId}
        onSelect={handleSubjectSelect}
      />

      {isFetching ? (
        <CardsGrid>
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <QueueCardSkeleton key={i} />
          ))}
        </CardsGrid>
      ) : isEmpty ? (
        <EmptyState
          variant="large"
          icon={UsersIcon}
          title="Черг не знайдено"
          description="Поки що немає активних або запланованих черг"
        />
      ) : (
        <CardsGrid>
          {queuesData.items.map((queue) => (
            <QueueCard
              key={queue.id}
              id={queue.id}
              shortTitle={queue.shortTitle}
              subjectName={queue.subjectName}
              queueStatus={queue.queueStatus}
              queueStartTime={queue.queueStartTime}
              registrationStartTime={queue.registrationStartTime}
              location={queue.location}
              meetUrl={queue.meetUrl}
              entriesCount={queue.entriesCount}
              guaranteedSlots={queue.guaranteedSlots}
              isUserJoined={queue.isUserJoined}
              currentStudentName={queue.currentStudentName}
            />
          ))}
        </CardsGrid>
      )}

      {!isFetching && queuesData?.totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={queuesData.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </SectionWrapper>
  );
};

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  /* align-self: stretch щоб розтягнутись на всю ширину PageWrapper
       навіть коли батько має align-items: flex-start */
  align-self: stretch;
  min-width: 0;
`;

const SectionTitle = styled.h2`
  font-size: 2.375rem;
  font-weight: 400;
  line-height: 2.5rem;
  color: var(--base-black);
  margin: 0;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 0.625rem;
  width: 100%;
  justify-content: center;
`;

export default AllQueuesSection;
