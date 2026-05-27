import { useActionState, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { closeCreateSubjectModal, closeEditSubjectModal } from '../../../store/uiSlice.js';
import { useCreateSubjectMutation, useUpdateSubjectMutation, useGetSubjectByIdQuery } from '../../../store/api/subjectApi.js';
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
import SaveIcon from '../../../assets/SaveBig.svg?react';
import { toast } from '../../../utils/toast.js';
import { SkeletonLine } from '../shared/ModalShared.jsx';

const SubjectModalManager = () => {
  const dispatch = useDispatch();
  
  const createModal = useSelector((state) => state.ui.createSubjectModal);
  const editModal = useSelector((state) => state.ui.editSubjectModal);
  
  const isOpen = createModal.isOpen || editModal.isOpen;
  const isEditMode = editModal.isOpen;
  const subjectId = editModal.subjectId;

  const { data: initialData, isFetching: isInitialLoading } = useGetSubjectByIdQuery(subjectId, {
    skip: !isEditMode || !subjectId,
  });

  const [createSubject] = useCreateSubjectMutation();
  const [updateSubject] = useUpdateSubjectMutation();

  const handleClose = () => {
    if (isEditMode) dispatch(closeEditSubjectModal());
    else dispatch(closeCreateSubjectModal());
  };

  const handleSubmit = async (formData) => {
    try {
      if (isEditMode) {
        await updateSubject({ id: subjectId, formData }).unwrap();
        toast.success('Предмет оновлено');
      } else {
        await createSubject(formData).unwrap();
        toast.success('Предмет створено');
      }
      handleClose();
    } catch (error) {
      toast.error('Помилка збереження: ' + (error?.data?.message || 'Невідома помилка'));
    }
  };

  if (!isOpen) return null;
  if (isEditMode && isInitialLoading) return <Modal isOpen={isOpen} onClose={handleClose} title="Завантаження..."><SkeletonLine /></Modal>;

  return (
    <SubjectFormModal
      key={subjectId || 'create'}
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      initialData={initialData}
      isEditMode={isEditMode}
    />
  );
};

const SubjectFormModal = ({ isOpen, onClose, onSubmit, initialData, isEditMode }) => {
  const [coverFile, setCoverFile] = useState(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

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
        [maxLengthHelper(100), "Ім'я викладача не може перевищувати 100 символів"],
      ],
    });

    if (!isEditMode && !coverFile) {
      errors.coverImage = 'Оберіть обкладинку';
    }

    if (Object.keys(errors).length > 0) {
      return { values, errors };
    }

    const data = new FormData();
    data.append('name', values.name);
    data.append('shortName', values.shortName);
    data.append('lecturer', values.lecturer);
    if (coverFile) {
      data.append('coverImage', coverFile);
    }
    if (isEditMode) {
        data.append('removeExistingImage', removeExistingImage);
    }

    await onSubmit(data);
    return { values: {}, errors: null };
  }

  const [{ values, errors }, formAction, isPending] = useActionState(submitAction, {
    values: {},
    errors: null,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Редагувати предмет" : "Створити предмет"}>
      <form style={{ display: 'contents' }} action={formAction}>
        <FieldGroup>
          <Input
            label="Повна назва предмету"
            name="name"
            id="subject-name"
            defaultValue={values.name || initialData?.name || ''}
            error={errors?.name}
          />
          <Input
            label="Коротка назва предмету"
            name="shortName"
            id="subject-short-name"
            defaultValue={values.shortName || initialData?.shortName || ''}
            error={errors?.shortName}
          />
          <Input
            label="Викладач"
            name="lecturer"
            id="subject-lecturer"
            defaultValue={values.lecturer || initialData?.lecturer || ''}
            error={errors?.lecturer}
          />
        </FieldGroup>

        <FileDropzone
          label="Обкладинка"
          value={coverFile}
          onChange={(file) => {
              setCoverFile(file);
              if (file) setRemoveExistingImage(true);
          }}
          accept="image/*"
          error={errors?.coverImage}
          hint={isEditMode && initialData?.imgUrl ? "Завантажте нове фото, щоб замінити поточне" : undefined}
        />

        <Button type="submit" fullWidth variant="primary" disabled={isPending}>
          {isEditMode ? <SaveIcon width="1rem" height="1rem" /> : <PlusIcon width="1rem" height="1rem" />}
          {isPending ? 'Збереження...' : (isEditMode ? 'Зберегти зміни' : 'Додати предмет')}
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

export default SubjectModalManager;
