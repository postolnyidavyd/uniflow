import { useDispatch, useSelector } from 'react-redux';
import {
  useCreateEventMutation,
  useGetEventByIdQuery,
  useUpdateEventMutation,
} from '../../../store/api/eventApi.js';
import {
  closeCreateEventModal,
  closeEditEventModal,
} from '../../../store/uiSlice.js';
import { toast } from '../../../utils/toast.js';
import { SkeletonLine } from '../shared/ModalShared.jsx';
import EventFormModal from './EventFormModal.jsx';

const EventModalManager = () => {
  const dispatch = useDispatch();

  const createModal = useSelector((state) => state.ui.createEventModal);
  const editModal = useSelector((state) => state.ui.editEventModal);

  const isOpen = createModal.isOpen || editModal.isOpen;
  const isEditMode = editModal.isOpen;
  const eventId = editModal.eventId;

  const { data: initialData, isFetching } = useGetEventByIdQuery(eventId, {
    skip: !isEditMode || !eventId,
  });

  const eventType =
    isEditMode && initialData
      ? initialData.calendarItemType
      : createModal.eventType || 'Event';

  const [createEvent] = useCreateEventMutation();
  const [updateEvent] = useUpdateEventMutation();

  const handleClose = () => {
    if (isEditMode) dispatch(closeEditEventModal());
    else dispatch(closeCreateEventModal());
  };

  const handleSubmit = async (formData) => {
    try {
      if (isEditMode) {
        await updateEvent({ id: eventId, ...formData }).unwrap();
        toast.success('Зміни збережено');
      } else {
        await createEvent({ type: eventType, ...formData }).unwrap();
        toast.success('Подію створено');
      }
      handleClose();
    } catch (error) {
      const errorMessage = error?.data?.message || 'Не вдалося зберегти зміни';
      toast.error(errorMessage);
      throw error; // Перекидаємо далі для форми
    }
  };

  if (!isOpen) return null;
  if (isEditMode && isFetching) return <SkeletonLine />;

  return (
    <EventFormModal
      key={eventId || 'create'}
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      initialValues={initialData || {}}
      isEditMode={isEditMode}
      eventType={eventType}
    />
  );
};

export default EventModalManager;
