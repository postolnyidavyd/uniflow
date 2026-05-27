import styled from 'styled-components';
import { useState } from 'react';
import { useJoinQueueMutation } from '../../store/api/queueApi.js';
import RadioGroup from '../ui/inputs/radio/RadioGroup.jsx';
import Button from '../ui/Button.jsx';
import SubmissionModeHint from '../SubmissionModeHint.jsx';
import LightningIcon from '../../assets/lightning_fill.svg?react';
import { toast } from '../../utils/toast.js';

const JoinQueueForm = ({
  sessionId,
  submissionMode,
  isAllowedToSubmitMoreThanOne,
}) => {
  const [submitSecondWork, setSubmitSecondWork] = useState(false);
  const [joinQueue, { isLoading }] = useJoinQueueMutation();

  const handleJoin = async (usedToken) => {
    try {
      await joinQueue({
        sessionId,
        usedToken,
        submitSecondWork: isAllowedToSubmitMoreThanOne
          ? submitSecondWork
          : false,
      }).unwrap();
      toast.success('Ви успішно записалися в чергу');
    } catch (e) {
      toast.error(e?.data?.message || 'Не вдалося записатися в чергу');
    }
  };

  return (
    <FormContainer>
      {isAllowedToSubmitMoreThanOne && (
        <>
          <Title>Кількість робіт:</Title>
          <RadioGroup
            name="worksCount"
            value={submitSecondWork ? 'Two' : 'One'}
            onChange={(val) => setSubmitSecondWork(val === 'Two')}
            options={[
              { value: 'One', label: 'Одна' },
              { value: 'Two', label: 'Дві' },
            ]}
          />
        </>
      )}

      {submitSecondWork && submissionMode && (
        <HintWrapper>
          <SubmissionModeHint mode={submissionMode} />
        </HintWrapper>
      )}

      <Actions>
        <PriorityAction>
          <Button
            variant="primary"
            onClick={() => handleJoin(true)}
            isLoading={isLoading}
            disabled={isLoading}
          >
            <LightningIcon width={20} height={20} />
            Записатися з пріоритетом (-1 токен)
          </Button>
          {submitSecondWork && (
            <PriorityHint>Пріоритет діє тільки на першу роботу</PriorityHint>
          )}
        </PriorityAction>

        <Button
          variant="secondary"
          onClick={() => handleJoin(false)}
          isLoading={isLoading}
          disabled={isLoading}
        >
          Записатися звичайно
        </Button>
      </Actions>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem 2rem;
  border-radius: 1.25rem;
  border: 1.901px solid var(--base-bright-grey, #e7eef3);
  background: var(--base-white);
  width: 100%;
  max-width: 500px;
  align-self: center;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5rem; /* 120% */
  letter-spacing: -0.025rem;

  color: var(--base-black);
  margin: 0;
`;

const HintWrapper = styled.div`
  align-self: stretch;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const PriorityAction = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
`;

const PriorityHint = styled.p`
  font-size: var(--desktop-headings-h9);
  font-weight: 300;
  line-height: 1rem;
  color: var(--base-black);
  opacity: 0.6;
  text-align: center;
`;

export default JoinQueueForm;
