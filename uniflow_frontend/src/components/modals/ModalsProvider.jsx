import EventDetailModal from './EventDetailModal.jsx';
import QueueDetailModal from './QueueDetailModal.jsx';
import DayDetailDrawer from "./DayDetailDrawer.jsx";

const ModalsProvider = () => {
  return (
    <>
      <DayDetailDrawer />
      <EventDetailModal />
      <QueueDetailModal />
    </>
  );
};

export default ModalsProvider;
