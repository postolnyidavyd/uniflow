import EventDetailModal from './EventDetailModal.jsx';
import QueueDetailModal from './QueueDetailModal.jsx';
import DayDetailDrawer from './DayDetailDrawer.jsx';
import CreateOptionsModal from './createAndEditModals/CreateOptionsModal.jsx';
import EventModalManager from './createAndEditModals/EventModalManager.jsx';
import CreateSubjectModal from './createAndEditModals/CreateSubjectModal.jsx';

const ModalsProvider = () => {
  return (
    <>
      <DayDetailDrawer />
      <EventDetailModal />
      <QueueDetailModal />
      <CreateOptionsModal />
      <EventModalManager />
      <CreateSubjectModal />
    </>
  );
};

export default ModalsProvider;
