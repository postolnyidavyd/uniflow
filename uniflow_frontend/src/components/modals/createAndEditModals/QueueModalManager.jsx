import { useActionState, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeCreateQueueModal,
  closeEditQueueModal,
} from '../../../store/uiSlice.js';
import {
  useCreateQueueMutation,
  useUpdateQueueMutation,
  useGetQueueByIdQuery,
} from '../../../store/api/queueApi.js';
import { useGetSubjectsShortQuery } from '../../../store/api/subjectApi.js';
import Modal from '../../ui/Modal.jsx';
import Button from '../../ui/Button.jsx';
import Input from '../../ui/inputs/Input.jsx';
import Select from '../../ui/inputs/Select.jsx';
import DateTimeInput from '../../ui/inputs/DateTimeInput.jsx';
import Toggle from '../../ui/Toggle.jsx';
import RadioGroup from '../../ui/inputs/radio/RadioGroup.jsx';
import SubmissionModeHint from '../../SubmissionModeHint.jsx';
import {
  maxLengthHelper,
  required,
  validate,
} from '../../../utils/validation.js';
import PlusIcon from '../../../assets/Plus.svg?react';
import SaveIcon from '../../../assets/SaveBig.svg?react';
import { toast } from '../../../utils/toast.js';
import { localToUTC, utcToLocal } from '../../../utils/timeConvertor.js';
import { SkeletonLine } from '../shared/ModalShared.jsx';

const formatOptions = [
  { value: 'Offline', label: 'Офлайн' },
  { value: 'Online', label: 'Онлайн' },
];

const QueueModalManager = () => {
  const dispatch = useDispatch();

  const createModal = useSelector((state) => state.ui.createQueueModal);
  const editModal = useSelector((state) => state.ui.editQueueModal);

  const isOpen = createModal.isOpen || editModal.isOpen;
  const isEditMode = editModal.isOpen;
  const sessionId = editModal.sessionId;

  const { data: initialData, isFetching: isInitialLoading } =
    useGetQueueByIdQuery(sessionId, {
      skip: !isEditMode || !sessionId,
    });

  const [createQueue] = useCreateQueueMutation();
  const [updateQueue] = useUpdateQueueMutation();

  const handleClose = () => {
    if (isEditMode) dispatch(closeEditQueueModal());
    else dispatch(closeCreateQueueModal());
  };

  const handleSubmit = async (formData) => {
    try {
      if (isEditMode) {
        await updateQueue({ id: sessionId, ...formData }).unwrap();
        toast.success('Чергу оновлено');
      } else {
        await createQueue(formData).unwrap();
        toast.success('Чергу створено');
      }
      handleClose();
    } catch (error) {
      const errorMessage = error?.data?.message || 'Не вдалося зберегти зміни';
      toast.error(errorMessage);
      throw error; // Перекидаємо далі для submitAction
    }
  };

  if (!isOpen) return null;
  if (isEditMode && isInitialLoading)
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Завантаження...">
        <SkeletonLine />
      </Modal>
    );

  return (
    <QueueFormModal
      key={sessionId || 'create'}
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      initialData={initialData}
      isEditMode={isEditMode}
    />
  );
};

const parseDuration = (duration) => {
  if (!duration) return 80;
  if (typeof duration === 'string') {
    const [hours, minutes] = duration.split(':').map(Number);
    return hours * 60 + minutes;
  }
  return (duration.hours || 0) * 60 + (duration.minutes || 0);
};

const QueueFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditMode,
}) => {
  const { data: subjectList } = useGetSubjectsShortQuery(undefined, {
    skip: !isOpen,
  });

  const formattedInitialValues = {
    ...initialData,
    queueStartTime:
      isEditMode && initialData?.queueStartTime
        ? utcToLocal(initialData.queueStartTime)
        : '',
    registrationStartTime:
      isEditMode && initialData?.registrationStartTime
        ? utcToLocal(initialData.registrationStartTime)
        : '',
    durationMinutes: isEditMode ? parseDuration(initialData?.duration) : 80,
    averageMinutesPerStudent: initialData?.averageMinutesPerStudent || 10,
  };

  const [format, setFormat] = useState(initialData?.eventFormat || 'Offline');
  const [allowMultiple, setAllowMultiple] = useState(
    initialData?.isAllowedToSubmitMoreThanOne || false
  );
  const [submissionMode, setSubmissionMode] = useState(
    initialData?.submissionMode || 'Split'
  );
  const [durationMinutes, setDurationMinutes] = useState(
    formattedInitialValues.durationMinutes
  );
  const [avgMinutes, setAvgMinutes] = useState(
    formattedInitialValues.averageMinutesPerStudent
  );

  useEffect(() => {
    if (initialData) {
      setFormat(initialData.eventFormat);
      setAllowMultiple(initialData.isAllowedToSubmitMoreThanOne);
      setSubmissionMode(initialData.submissionMode);
      setDurationMinutes(parseDuration(initialData.duration));
      setAvgMinutes(initialData.averageMinutesPerStudent);
    }
  }, [initialData]);

  const guaranteedSlots =
    avgMinutes > 0 ? Math.floor(durationMinutes / avgMinutes) : 0;

  const [{ values, errors }, formAction, isPending] = useActionState(
    submitAction,
    {
      values: formattedInitialValues,
      errors: null,
    }
  );

  async function submitAction(prevState, formData) {
    const formValues = Object.fromEntries(formData.entries());
    const isOnline = formValues.eventFormat === 'Online';

    const rules = {
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
    };

    const validationErrors = validate(formValues, rules);

    if (Object.keys(validationErrors).length > 0) {
      return { values: formValues, errors: validationErrors };
    }

    try {
      const payload = {
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
      };

      await onSubmit(payload);
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

  const subjectOptions = subjectList?.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Редагувати чергу' : 'Створити чергу'}
    >
      <form style={{ display: 'contents' }} action={formAction}>
        <InputGroup>
          <Select
            label="Предмет"
            name="subjectId"
            id="queue-subject"
            options={subjectOptions}
            defaultValue={values.subjectId || initialData?.subjectId || ''}
            error={errors?.subjectId}
            key={values.subjectId || initialData?.subjectId}
          />

          <TwoColGrid $cols="4fr 3fr">
            <Input
              label="Назва черги"
              name="title"
              id="queue-title"
              defaultValue={values.title || initialData?.title || ''}
              error={errors?.title}
            />
            <Input
              label="Коротка назва"
              name="shortTitle"
              id="queue-short-title"
              defaultValue={values.shortTitle || initialData?.shortTitle || ''}
              error={errors?.shortTitle}
            />
          </TwoColGrid>
        </InputGroup>

        <InputGroup>
          <TwoColGrid $cols="1.5fr 4fr">
            <Select
              label="Формат черги"
              name="eventFormat"
              id="queue-format"
              options={formatOptions}
              onChange={(e) => setFormat(e.target.value)}
              defaultValue={
                values.eventFormat || initialData?.eventFormat || ''
              }
              error={errors?.eventFormat}
              key={`format-select-${values.eventFormat || initialData?.eventFormat}`}
            />
            <Input
              label={format === 'Offline' ? 'Місце проведення' : 'Посилання'}
              name={format === 'Offline' ? 'location' : 'meetUrl'}
              id="queue-location"
              defaultValue={
                format === 'Offline'
                  ? values.location || initialData?.location || ''
                  : values.meetUrl || initialData?.meetUrl || ''
              }
              error={errors?.location || errors?.meetUrl}
              key={`format-input-${format}`}
            />
          </TwoColGrid>
          <TwoColGrid $cols="1fr 1fr">
            <DateTimeInput
              label="Початок черги"
              name="queueStartTime"
              id="queue-start-time"
              defaultValue={
                values.queueStartTime ||
                (initialData?.queueStartTime
                  ? utcToLocal(initialData.queueStartTime)
                  : '')
              }
              error={errors?.queueStartTime}
            />
            <DateTimeInput
              label="Початок запису"
              name="registrationStartTime"
              id="queue-registration-time"
              defaultValue={
                values.registrationStartTime ||
                (initialData?.registrationStartTime
                  ? utcToLocal(initialData.registrationStartTime)
                  : '')
              }
              error={errors?.registrationStartTime}
            />
          </TwoColGrid>

          <TwoColGrid $cols="1fr 1fr">
            <Input
              label="Тривалість черги(хв.)"
              name="durationMinutes"
              id="queue-duration"
              type="number"
              defaultValue={
                values.durationMinutes ||
                (initialData?.duration
                  ? initialData.duration.hours * 60 +
                    initialData.duration.minutes
                  : 80)
              }
              error={errors?.durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
            />
            <Input
              label="Час на людину(хв.)"
              name="averageMinutesPerStudent"
              id="queue-avg-minutes"
              type="number"
              defaultValue={
                values.averageMinutesPerStudent ||
                initialData?.averageMinutesPerStudent ||
                10
              }
              error={errors?.averageMinutesPerStudent}
              onChange={(e) => setAvgMinutes(Number(e.target.value))}
            />
          </TwoColGrid>

          <SlotsInfo>
            Розрахована кількість гарантованих місць:{' '}
            <strong>{guaranteedSlots}</strong>
          </SlotsInfo>
        </InputGroup>

        <InputGroup>
          <Toggle
            checked={allowMultiple}
            label="Дозволити здачу кількох робіт"
            onChange={(e) => setAllowMultiple(e.target.checked)}
          />

          {allowMultiple && (
            <ModeSection>
              <RadioGroup
                name="submissionModeUi"
                value={submissionMode}
                onChange={setSubmissionMode}
                options={[
                  { value: 'Batch', label: 'Разом' },
                  { value: 'Split', label: 'Окремо' },
                ]}
              />
              <SubmissionModeHint mode={submissionMode} />
            </ModeSection>
          )}
        </InputGroup>
        <Button type="submit" fullWidth variant="primary" disabled={isPending}>
          {isEditMode ? (
            <SaveIcon width="1rem" height="1rem" />
          ) : (
            <PlusIcon width="1rem" height="1rem" />
          )}
          {isPending
            ? 'Збереження...'
            : isEditMode
              ? 'Зберегти зміни'
              : 'Додати чергу'}
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
  font-weight: 400;
  line-height: 1rem;
  color: var(--base-black, #000);
`;

const ModeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ErrorText = styled.p`
  font-size: 0.8rem;
  color: var(--brick-red-100);
  text-align: center;
  margin: 0;
`;

export default QueueModalManager;
