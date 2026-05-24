import EventDetailModal from './EventDetailModal.jsx';
import QueueDetailModal from './QueueDetailModal.jsx';
import DayDetailDrawer from './DayDetailDrawer.jsx';
import CreateOptionsModal from './createAndEditModals/CreateOptionsModal.jsx';
import EventModalManager from './createAndEditModals/EventModalManager.jsx';
import CreateSubjectModal from './createAndEditModals/CreateSubjectModal.jsx';
import CreateQueueModal from './createAndEditModals/CreateQueueModal.jsx';
import LeaveQueueModal from './LeaveQueueModal.jsx';

const ModalsProvider = () => {
  return (
    <>
      <DayDetailDrawer />
      <EventDetailModal />
      <QueueDetailModal />
      <CreateOptionsModal />
      <EventModalManager />
      <CreateSubjectModal />
      <CreateQueueModal />
      <LeaveQueueModal />
    </>
  );
};

export default ModalsProvider;
