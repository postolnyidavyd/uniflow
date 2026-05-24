import styled from 'styled-components';
import UserQueuesSection from '../components/queues/UserQueuesSection.jsx';
import AllQueuesSection from "../components/queues/AllQueueSection.jsx";
import { useDispatch, useSelector } from 'react-redux';
import { selectUserRole } from '../store/selectors/authSelector.js';
import { openCreateQueueModal } from '../store/uiSlice.js';
import Button from '../components/ui/Button.jsx';
import PlusIcon from '../assets/Plus.svg?react';

function QueuesPage() {
  const dispatch = useDispatch();
  const role = useSelector(selectUserRole);

  const handleAddQueue = () => dispatch(openCreateQueueModal());

  return (
    <PageWrapper>
      <Header>
        <h1>Черги</h1>
        {role === 'Headman' && (
          <Button size="md" onClick={handleAddQueue}>
            <PlusIcon width="1.5rem" height="1.5rem" />
            Додати чергу
          </Button>
        )}
      </Header>

      <h2>Мої черги</h2>
      <UserQueuesSection />
      <AllQueuesSection/>
    </PageWrapper>
  );
}

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
  align-items: stretch;
  gap: 0.625rem;

  h1 {
    font-size: 3.5rem;
    font-style: normal;
    font-weight: 400;
    line-height: 3.75rem; /* 107.143% */
    letter-spacing: -0.07rem;
  }
  h2 {
    margin-top: 1rem;
    font-size: 2.375rem;
    font-style: normal;
    font-weight: 400;
    line-height: 2.5rem; /* 105.263% */
  }
`;

export default QueuesPage;
