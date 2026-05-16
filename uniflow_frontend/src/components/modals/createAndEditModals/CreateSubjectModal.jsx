import { useActionState, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { closeCreateSubjectModal } from '../../../store/uiSlice.js';
import { useCreateSubjectMutation } from '../../../store/api/subjectApi.js';
import Modal from '../../ui/Modal.jsx';
import Button from '../../ui/Button.jsx';
import Input from '../../ui/inputs/Input.jsx';
import FileDropzone from '../../ui/inputs/FileDropzone.jsx';
import {
  maxLengthHelper,
  required,
  validate,
} from '../../../utils/validation.js';
import PlusIcon from '../../../assets/Plus.svg?react';

const CreateSubjectModal = () => {
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state) => state.ui.createSubjectModal);
  const [createSubject, { isLoading }] = useCreateSubjectMutation();

  // Файл живе в окремому useState — FormData не серіалізується в useActionState
  const [coverFile, setCoverFile] = useState(null);

  async function submitAction(prevState, formData) {
    const values = Object.fromEntries(formData.entries());

    const errors = validate(values, {
      name: [
        [required, 'Введіть назву предмету'],
        [maxLengthHelper(100), 'Назва не може перевищувати 100 символів'],
      ],
      shortName: [
        [required, 'Введіть коротку назву'],
        [maxLengthHelper(20), 'Коротка назва не може перевищувати 20 символів'],
      ],
      lecturer: [
        [required, 'Введіть викладача'],
        [
          maxLengthHelper(100),
          "Ім'я викладача не може перевищувати 100 символів",
        ],
      ],
    });

    // Файл живе поза FormData, тому перевіряємо окремо
    if (!coverFile) {
      errors.coverImage = 'Оберіть обкладинку';
    }

    if (Object.keys(errors).length > 0) {
      return { values, errors };
    }

    // Будуємо multipart FormData для Cloudinary upload на бекенді
    const data = new FormData();
    data.append('name', values.name);
    data.append('shortName', values.shortName);
    data.append('lecturer', values.lecturer);
    if (coverFile) {
      data.append('coverImage', coverFile);
    }

    try {
      await createSubject(data).unwrap();
      setCoverFile(null);
      handleClose();
      return { values: {}, errors: null };
    } catch (e) {
      return {
        values,
        errors: {
          server: e?.data?.message ?? 'Невідома помилка, спробуйте пізніше',
        },
      };
    }
  }

  const [{ values, errors }, formAction] = useActionState(submitAction, {
    values: {},
    errors: null,
  });

  const handleClose = () => {
    dispatch(closeCreateSubjectModal());
    setCoverFile(null);
  };
  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Створити предмет">
      <form
        style={{ display: 'contents' }}
        action={formAction}
        onSubmit={(e) => {
          if (e.nativeEvent.submitter?.type !== 'submit') {
            e.preventDefault();
          }
        }}
      >
        <FieldGroup>
          <Input
            label="Повна назва предмету"
            name="name"
            id="create-subject-name"
            defaultValue={values.name || ''}
            error={errors?.name}
          />
          <Input
            label="Коротка назва предмету"
            name="shortName"
            id="create-subject-short-name"
            defaultValue={values.shortName || ''}
            error={errors?.shortName}
          />
          <Input
            label="Викладач"
            name="lecturer"
            id="create-subject-lecturer"
            defaultValue={values.lecturer || ''}
            error={errors?.lecturer}
          />
        </FieldGroup>

        <FileDropzone
          label="Обкладинка"
          value={coverFile}
          onChange={setCoverFile}
          accept="image/*"
          error={errors?.coverImage}
        />

        <Button type="submit" fullWidth variant="primary" disabled={isLoading}>
          <PlusIcon width="1rem" height="1rem" />
          {isLoading ? 'Збереження...' : 'Додати предмет'}
        </Button>

        {errors?.server && <ErrorText>{errors.server}</ErrorText>}
      </form>
    </Modal>
  );
};

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  align-self: stretch;
`;

const ErrorText = styled.p`
  font-size: 0.8rem;
  color: var(--brick-red-100);
  text-align: center;
  margin: 0;
`;

export default CreateSubjectModal;
