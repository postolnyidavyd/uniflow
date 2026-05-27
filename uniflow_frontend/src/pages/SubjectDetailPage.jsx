import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import {
  useGetSubjectByIdQuery,
  useLazyGetSubjectMarkdownQuery,
  useUpdateMarkdownMutation,
} from '../store/api/subjectApi.js';
import DashboardPanelUpcoming from '../components/dashboardUpcoming/DashboardPanelUpcoming.jsx';
import HtmlRenderer from '../components/HtmlRenderer.jsx';
import Button from '../components/ui/Button.jsx';
import EditIcon from '../assets/Edit.svg?react';
import SaveIcon from '../assets/SaveBig.svg?react';
import SubjectSubscriptionButton from '../components/subjects/SubjectSubscriptionButton.jsx';
import { useSelector } from 'react-redux';
import { selectUserRole } from '../store/selectors/authSelector.js';
import { useState} from 'react';
import { toast } from '../utils/toast.js';
import MarkdownEditor from "../components/MarkdownEditor.jsx";
import BackButton from '../components/ui/BackButton.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import InfoIcon from '../assets/Info.svg?react';

import { SubjectDetailSkeleton } from '../components/ui/skeletons/SubjectDetailSkeleton.jsx';

function SubjectDetailPage() {
  const role = useSelector(selectUserRole);
  const { subjectId } = useParams();
  const { data: subjectDetail, isFetching } = useGetSubjectByIdQuery(subjectId, {
    skip: !subjectId,
  });
  const [fetchMarkdown, { isFetching: isMarkdownLoading }] =
    useLazyGetSubjectMarkdownQuery();

  const [updateMarkdown] = useUpdateMarkdownMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const handleEdit = async () => {
    if (isEditing) {
      try {
        await updateMarkdown({
          id: subjectId,
          markdownContent: editValue,
        }).unwrap();
        toast.success('Інформацію успішно оновлено');
        setIsEditing(false);
      } catch {
        toast.error('Помилка збереження інформації');
      }
    } else {
      try {
        const data = await fetchMarkdown(subjectId).unwrap();
        setEditValue(data);
        setIsEditing(true);
      } catch {
        toast.error('Не вдалося завантажити дані для редагування');
      }
    }
  };

  return (
    <PageWrapper>
      <MainContent>
        {isFetching ? (
          <SubjectDetailSkeleton />
        ) : (
          <CenteredContainer>
            <BackButton to="/subjects" label="До предметів" />
            <HeaderWrapper>
              <HeaderInfo>
                <h1>{subjectDetail?.name}</h1>
                <h4>Викладач: {subjectDetail?.lecturer}</h4>
              </HeaderInfo>

              <ActionButtons>
                <SubjectSubscriptionButton
                  subjectId={subjectId}
                  isSubscribed={subjectDetail?.isSubscribed}
                  subjectName={subjectDetail?.name}
                />
                {role === 'Headman' && (
                  <Button
                    fullWidth
                    variant="secondary"
                    onClick={handleEdit}
                    isLoading={isMarkdownLoading}
                  >
                    {isEditing ? (
                      <>
                        <SaveIcon width="1.5rem" height="1.5rem" />
                        Зберегти зміни
                      </>
                    ) : (
                      <>
                        <EditIcon width="1.5rem" height="1.5rem" />
                        Змінити інформацію
                      </>
                    )}
                  </Button>
                )}
              </ActionButtons>
            </HeaderWrapper>
            {isEditing ? (
              <MarkdownEditor value={editValue} onChange={setEditValue} />
            ) : subjectDetail?.renderedContent ? (
              <HtmlRenderer htmlContent={subjectDetail.renderedContent} />
            ) : (
              <EmptyState
                variant="medium"
                icon={InfoIcon}
                title="Інформація відсутня"
                description="Для цього предмета ще не додано опис або додаткові матеріали."
              />
            )}
          </CenteredContainer>
        )}
      </MainContent>

      <SidePanelWrapper>
        <DashboardPanelUpcoming orientation="vertical" subjectId={subjectId} />
      </SidePanelWrapper>
    </PageWrapper>
  );
}


const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: stretch;
  margin-top: 0.5rem;
  min-width: 17rem;
  flex-shrink: 0;

  @media (max-width: 600px) {
    margin-top: 1rem;
    min-width: 100%;
    flex-shrink: 1;
  }
  
  svg {
    flex-shrink: 0;
  }
`;

const PageWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  height: 100dvh;
  overflow: hidden;
  gap: 1rem;
`;

const MainContent = styled.div`
  flex: 1;
  min-width: 0;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
  padding: 2rem 1rem;
`;

const CenteredContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  h1 {
    font-size: 3.5rem;
    font-style: normal;
    font-weight: 400;
    line-height: 3.75rem; /* 107.143% */
    letter-spacing: -0.07rem;
    margin: 0;
  }
  h4 {
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.75rem; /* 116.667% */
    letter-spacing: -0.00719rem;
    margin: 0;
    color: var(--base-black, #000);
    opacity: 0.6;
  }
`;

const SidePanelWrapper = styled.div`
  flex-shrink: 0;
  height: 100%;
  padding: 1rem;
  border-radius: 0.625rem 0 0 0.625rem;
  border: 2px solid var(--base-bright-grey, #e7eef3);
`;

export default SubjectDetailPage;
