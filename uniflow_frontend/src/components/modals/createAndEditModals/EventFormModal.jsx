import Modal from '../../ui/Modal.jsx';
import { useActionState, useState } from 'react';
import styled from 'styled-components';
import Button from '../../ui/Button.jsx';
import Select from '../../ui/inputs/Select.jsx';
import Input from '../../ui/inputs/Input.jsx';
import DateTimeInput from '../../ui/inputs/DateTimeInput.jsx';
import Textarea from '../../ui/inputs/Textarea.jsx';
import {
  maxLengthHelper,
  required,
  validate,
} from '../../../utils/validation.js';

import PlusIcon from '../../../assets/Plus.svg?react';
import {
  useGetSubjectsShortQuery,
} from '../../../store/api/subjectApi.js';
import {localToUTC} from "../../../utils/timeConvertor.js";

const eventFormatSelectValues = [
  {
    value: 'Offline',
    label: 'Офлайн',
  },
  {
    value: 'Online',
    label: 'Онлайн',
  },
];
const EventFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  isEditMode,
  eventType,
}) => {
  const { data: subjectList } = useGetSubjectsShortQuery(undefined, {
    skip: !isOpen,
  });
  const [format, setFormat] = useState('Offline');
  const [{ values, errors }, formAction] = useActionState(submitAction, {
    values: initialValues ?? {},
    errors: null,
  });
  if (!isOpen) return null;
  //екшн
  async function submitAction(prevState, formData) {
    const formValues = Object.fromEntries(formData.entries());

    const isOnline = formValues.eventFormat === 'Online';
    if(formValues.date) formValues.date = localToUTC(formValues.date);

    const errors = validate(formValues, {
      subjectId: [[required, 'Оберіть предмет']],
      title: [
        [required, 'Введіть назву'],
        [maxLengthHelper(100), 'Назва не може перевищувати 100 символів'],
      ],
      shortTitle: [
        [required, 'Введіть коротку назву'],
        [maxLengthHelper(20), 'Коротка назва не може перевищувати 20 символів'],
      ],
      eventFormat: [[required, 'Оберіть формат']],
      ...(isOnline
        ? { meetUrl: [[required, 'Введіть посилання']] }
        : { location: [[required, 'Введіть місце проведення']] }),
      date: [[required, 'Вкажіть дату']],
    });

    if (Object.keys(errors).length > 0) {
      return { values: formValues, errors };
    }

    formValues.eventType = eventType;

    try {
      await onSubmit(formValues);
      onClose();
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

  //список предметів для вибору
  const subjectListSelectValues = subjectList?.map((subject) => ({
    value: subject.id,
    label: subject.name,
  }));

  // динамічні тексти залежно від типу
  const isDeadline = eventType === 'Deadline';

  const modalTitle = isEditMode
    ? `Редагувати ${isDeadline ? 'дедлайн' : 'подію'}`
    : `Створити ${isDeadline ? 'дедлайн' : 'подію'}`;

  const titleLabel = isDeadline ? 'Назва дедлайну' : 'Назва події';
  const formatSpecificLabel =
    format === 'Offline' ? 'Місце проведення' : 'Посилання';
  const dateLabel = isDeadline ? 'Кінцевий термін' : 'Дата проведення';
  const buttonText = isEditMode
    ? 'Зберегти зміни'
    : `Додати ${isDeadline ? 'дедлайн' : 'подію'}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <form style={{ display: 'contents' }} action={formAction}>
        <InputGroup>
          <Select
            label="Предмет"
            options={subjectListSelectValues}
            name="subjectId"
            id="create-event-subject-id"
            defaultValue={values.subjectId || ''}
            error={errors?.subjectId}
            key={values.subjectId}
          />
          <NameGroup>
            <Input
              label={titleLabel}
              name="title"
              id="create-event-title"
              defaultValue={values.title || ''}
              error={errors?.title}
            />
            <Input
              label="Коротка назва"
              name="shortTitle"
              id="create-event-title"
              defaultValue={values.shortTitle || ''}
              error={errors?.shortTitle}
            />
          </NameGroup>
        </InputGroup>
        <InputGroup>
          <FormatGroup>
            <Select
              label="Формат"
              options={eventFormatSelectValues}
              name="eventFormat"
              id="create-event-event-format"
              onChange={(e) => setFormat(e.target.value)}
              defaultValue={values.eventFormat || ''}
              error={errors?.eventFormat}
              key={values.eventFormat}
            />
            <Input
              label={formatSpecificLabel}
              name={format === 'Offline' ? 'location' : 'meetUrl'}
              id="create-event-format-specific-value"
              defaultValue={values.location || values.meetUrl || ''}
              error={errors?.location || errors?.meetUrl}
            />
          </FormatGroup>
          <DateTimeInput
            label={dateLabel}
            name="date"
            id="create-event-date"
            defaultValue={values.date || ''}
            error={errors?.date}
          />
        </InputGroup>

        <Textarea
          label="Деталі"
          name="description"
          id="create-event-description"
          defaultValue={values.description || ''}
        />
        <Button type="submit" fullWidth variant="primary">
          <PlusIcon width={'1rem'} height={'1rem'} />
          {buttonText}
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
const NameGroup = styled.div`
  display: grid;
  grid-template-columns: 4fr 3fr;
  grid-gap: 1rem;
`;
const FormatGroup = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 4fr;
  grid-gap: 1rem;
`;

const ErrorText = styled.p`
  font-size: 0.8rem;
  color: var(--brick-red-100);
  text-align: center;
`;
export default EventFormModal;
