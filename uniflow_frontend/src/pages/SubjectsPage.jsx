import { useDispatch, useSelector } from 'react-redux';
import { openCreateSubjectModal } from '../store/uiSlice.js';
import styled from 'styled-components';
import { selectUserRole } from '../store/selectors/authSelector.js';
import Button from '../components/ui/Button.jsx';
import PlusIcon from '../assets/Plus.svg?react';
import { useGetSubjectsQuery } from '../store/api/subjectApi.js';
import { SubjectCard } from '../components/subjects/SubjectCard.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import BookIcon from '../assets/BookBig.svg?react';
import { SubjectCardSkeleton } from '../components/ui/skeletons/SubjectCardSkeleton.jsx';

function SubjectsPage() {
  const dispatch = useDispatch();
  const role = useSelector(selectUserRole);
  const { data: subjects, isFetching } = useGetSubjectsQuery();

  const handleAddSubject = () => dispatch(openCreateSubjectModal());

  const isEmpty = !subjects || subjects.length === 0;

  return (
    <PageWrapper>
      <Header>
        <h1>Предмети</h1>
        {role === 'Headman' && (
          <Button size="md" onClick={handleAddSubject}>
            <PlusIcon width="1.5rem" height="1.5rem" />
            Додати предмет
          </Button>
        )}
      </Header>
      
      {isFetching ? (
        <CardsGrid>
          {Array.from({ length: 8 }).map((_, i) => (
            <SubjectCardSkeleton key={i} />
          ))}
        </CardsGrid>
      ) : isEmpty ? (
        <EmptyStateWrapper>
          <EmptyState 
            variant="large"
            icon={BookIcon}
            title="Поки що тихо..."
            description="Ще не додано жодного предмету"
          />
        </EmptyStateWrapper>
      ) : (
        <CardsGrid>
          {subjects?.map((subject) => (
            <SubjectCard
              key={subject.id}
              id={subject.id}
              imgUrl={subject.imgUrl}
              name={subject.name}
              lecturer={subject.lecturer}
              lastUpdatedAt={subject.lastUpdatedAt}
            />
          ))}
        </CardsGrid>
      )}
    </PageWrapper>
  );
}

const EmptyStateWrapper = styled.div`
  margin-top: 2rem;
  width: 100%;
`;

const CardsGrid = styled.div`
    margin-top: 2rem;
    display: grid;
    gap: 1.5rem;
    align-self: stretch;
    grid-template-columns: repeat(auto-fill, 23.25rem);
    justify-content: center;
`;
const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;
const PageWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 1rem 0.5rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625rem;
  box-sizing: border-box;

  h1 {
    font-size: 3.5rem;
    font-style: normal;
    font-weight: 400;
    line-height: 3.75rem; /* 107.143% */
    letter-spacing: -0.07rem;
  }
`;
export default SubjectsPage;
