import { useActionState, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { closeCreateQueueModal } from '../../../store/uiSlice.js';
import { useCreateQueueMutation } from '../../../store/api/queueApi.js';
import { useGetSubjectsShortQuery } from '../../../store/api/subjectApi.js';
import Modal from '../../ui/Modal.jsx';
import Button from '../../ui/Button.jsx';
import Input from '../../ui/inputs/Input.jsx';
import Select from '../../ui/inputs/Select.jsx';
import DateTimeInput from '../../ui/inputs/DateTimeInput.jsx';
import Toggle from '../../ui/Toggle.jsx';
import Radio from '../../ui/inputs/Radio.jsx';
import SubmissionModeHint from '../../SubmissionModeHint.jsx';
import {
  maxLengthHelper,
  required,
  validate,
} from '../../../utils/validation.js';
import PlusIcon from '../../../assets/Plus.svg?react';
import { toast } from '../../../utils/toast.js';
import { localToUTC } from '../../../utils/timeConvertor.js';

const formatOptions = [
  { value: 'Offline', label: 'Офлайн' },
  { value: 'Online', label: 'Онлайн' },
];

const CreateQueueModal = () => {
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state) => state.ui.createQueueModal);
  const [createQueue, { isLoading }] = useCreateQueueMutation();

  const { data: subjectList } = useGetSubjectsShortQuery(undefined, {
    skip: !isOpen,
  });

  const [format, setFormat] = useState('Offline');
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [submissionMode, setSubmissionMode] = useState('Split');
  const [durationMinutes, setDurationMinutes] = useState(80);
  const [avgMinutes, setAvgMinutes] = useState(10);

  const guaranteedSlots =
    avgMinutes > 0 ? Math.floor(durationMinutes / avgMinutes) : 0;

  const [{ values, errors }, formAction] = useActionState(submitAction, {
    values: {},
    errors: null,
  });

  async function submitAction(prevState, formData) {
    const formValues = Object.fromEntries(formData.entries());
    const isOnline = formValues.eventFormat === 'Online';

    const errors = validate(formValues, {
      subjectId: [[required, 'Оберіть предмет']],
      title: [
        [required, 'Введіть назву черги'],
        [maxLengthHelper(100), 'Назва не може перевищувати 100 символів'],
      ],
      shortTitle: [
        [required, 'Введіть коротку назву'],
        [maxLengthHelper(20), 'Коротка назва не може перевищувати 20 символів'],
      ],
      eventFormat: [[required, 'Оберіть формат']],
      queueStartTime: [[required, 'Вкажіть час початку черги']],
      registrationStartTime: [[required, 'Вкажіть час початку запису']],
      durationMinutes: [[required, 'Вкажіть тривалість']],
      averageMinutesPerStudent: [[required, 'Вкажіть час на людину']],
      ...(isOnline
        ? { meetUrl: [[required, 'Введіть посилання']] }
        : { location: [[required, 'Введіть місце проведення']] }),
    });

    if (Object.keys(errors).length > 0) {
      return { values: formValues, errors };
    }

    try {
      await createQueue({
        title: formValues.title,
        shortTitle: formValues.shortTitle,
        eventFormat: formValues.eventFormat,
        location: isOnline ? undefined : formValues.location,
        meetUrl: isOnline ? formValues.meetUrl : undefined,
        queueStartTime: localToUTC(formValues.queueStartTime),
        registrationStartTime: localToUTC(formValues.registrationStartTime),
        durationMinutes: Number(formValues.durationMinutes),
        averageMinutesPerStudent: Number(formValues.averageMinutesPerStudent),
        subjectId: formValues.subjectId,
        isAllowedToSubmitMoreThanOne: allowMultiple,
        submissionMode: allowMultiple ? submissionMode : 'Single',
      }).unwrap();

      toast.success('Чергу успішно заплановано');
      handleClose();
      return { values: {}, errors: null };
    } catch (e) {
      return {
        values: formValues,
        errors: {
          server: e?.data?.message ?? 'Невідома помилка, спробуйте пізніше',
        },
      };
    }
  }

  const handleClose = () => {
    dispatch(closeCreateQueueModal());
    setFormat('Offline');
    setAllowMultiple(false);
    setSubmissionMode('Split');
    setDurationMinutes(80);
    setAvgMinutes(10);
  };

  const subjectOptions = subjectList?.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Створити чергу">
      <form style={{ display: 'contents' }} action={formAction}>
        {/*Предмет і назва*/}
        <InputGroup>
          <Select
            label="Предмет"
            name="subjectId"
            id="create-queue-subject"
            options={subjectOptions}
            defaultValue={values.subjectId || ''}
            error={errors?.subjectId}
            key={values.subjectId}
          />

          <TwoColGrid $cols="4fr 3fr">
            <Input
              label="Назва черги"
              name="title"
              id="create-queue-title"
              defaultValue={values.title || ''}
              error={errors?.title}
            />
            <Input
              label="Коротка назва"
              name="shortTitle"
              id="create-queue-short-title"
              defaultValue={values.shortTitle || ''}
              error={errors?.shortTitle}
            />
          </TwoColGrid>
        </InputGroup>
        {/* Формат, час, тривалість і кількість місць*/}
        <InputGroup>
          <TwoColGrid $cols="1.5fr 4fr">
            <Select
              label="Формат черги"
              name="eventFormat"
              id="create-queue-format"
              options={formatOptions}
              onChange={(e) => setFormat(e.target.value)}
              defaultValue={values.eventFormat || ''}
              error={errors?.eventFormat}
              key={values.eventFormat}
            />
            <Input
              label={format === 'Offline' ? 'Місце проведення' : 'Посилання'}
              name={format === 'Offline' ? 'location' : 'meetUrl'}
              id="create-queue-location"
              defaultValue={values.location || values.meetUrl || ''}
              error={errors?.location || errors?.meetUrl}
            />
          </TwoColGrid>
          <TwoColGrid $cols="1fr 1fr">
            <DateTimeInput
              label="Початок черги"
              name="queueStartTime"
              id="create-queue-start-time"
              defaultValue={values.queueStartTime || ''}
              error={errors?.queueStartTime}
            />
            <DateTimeInput
              label="Початок запису"
              name="registrationStartTime"
              id="create-queue-registration-time"
              defaultValue={values.registrationStartTime || ''}
              error={errors?.registrationStartTime}
            />
          </TwoColGrid>

          {/* Тривалість + час на людину */}
          <TwoColGrid $cols="1fr 1fr">
            <Input
              label="Тривалість черги(хв.)"
              name="durationMinutes"
              id="create-queue-duration"
              type="number"
              defaultValue={values.durationMinutes || 80}
              error={errors?.durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
            />
            <Input
              label="Час на людину(хв.)"
              name="averageMinutesPerStudent"
              id="create-queue-avg-minutes"
              type="number"
              defaultValue={values.averageMinutesPerStudent || 10}
              error={errors?.averageMinutesPerStudent}
              onChange={(e) => setAvgMinutes(Number(e.target.value))}
            />
          </TwoColGrid>

          {/* Розрахована кількість місць */}
          <SlotsInfo>
            Розрахована кількість гарантованих місць:{' '}
            <strong>{guaranteedSlots}</strong>
          </SlotsInfo>
        </InputGroup>

        {/*Режим здачі*/}
        <InputGroup>
          {/* дозволити здачу кількох робіт */}
          <Toggle
            checked={allowMultiple}
            label="Дозволити здачу кількох робіт"
            onChange={(e) => setAllowMultiple(e.target.checked)}
          />

          {/* Режим здачі*/}
          {allowMultiple && (
            <ModeSection>
              <RadioGroup>
                <Radio
                  label="Разом"
                  name="submissionModeUi"
                  value="Batch"
                  checked={submissionMode === 'Batch'}
                  onChange={() => setSubmissionMode('Batch')}
                />
                <Radio
                  label="Окремо"
                  name="submissionModeUi"
                  value="Split"
                  checked={submissionMode === 'Split'}
                  onChange={() => setSubmissionMode('Split')}
                />
              </RadioGroup>

              <SubmissionModeHint mode={submissionMode} />
            </ModeSection>
          )}
        </InputGroup>
        <Button type="submit" fullWidth variant="primary" disabled={isLoading}>
          <PlusIcon width="1rem" height="1rem" />
          {isLoading ? 'Збереження...' : 'Додати чергу'}
        </Button>

        {errors?.server && <ErrorText>{errors.server}</ErrorText>}
      </form>
    </Modal>
  );
};
const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-self: stretch;
`;

const TwoColGrid = styled.div`
  display: grid;
  grid-template-columns: ${({ $cols }) => $cols || '1fr 1fr'};
  gap: 1rem;
  align-self: stretch;
`;

const SlotsInfo = styled.div`
  display: flex;
  padding: 0.25rem 0.5rem;
  align-items: center;
  gap: 0.25rem;
  align-self: stretch;
  border-radius: 0.125rem;
  background: var(--gorse-40, #fff0b7);

  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem; /* 133.333% */
  letter-spacing: -0.015rem;
  color: var(--base-black, #000);
`;

const ModeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const ErrorText = styled.p`
  font-size: 0.8rem;
  color: var(--brick-red-100);
  text-align: center;
  margin: 0;
`;

export default CreateQueueModal;
