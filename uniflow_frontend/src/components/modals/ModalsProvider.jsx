import EventDetailModal from './EventDetailModal.jsx';
import QueueDetailModal from './QueueDetailModal.jsx';
import DayDetailDrawer from './DayDetailDrawer.jsx';
import CreateOptionsModal from './createAndEditModals/CreateOptionsModal.jsx';
import EventModalManager from './createAndEditModals/EventModalManager.jsx';
import SubjectModalManager from './createAndEditModals/SubjectModalManager.jsx';
import QueueModalManager from './createAndEditModals/QueueModalManager.jsx';
import LeaveQueueModal from './LeaveQueueModal.jsx';
import ConfirmationModal from './shared/ConfirmationModal.jsx';

const ModalsProvider = () => {
  return (
    <>
      <DayDetailDrawer />
      <EventDetailModal />
      <QueueDetailModal />
      <CreateOptionsModal />
      <EventModalManager />
      <SubjectModalManager />
      <QueueModalManager />
      <LeaveQueueModal />
      <ConfirmationModal />
    </>
  );
};

export default ModalsProvider;
