export const selectUi = (state) => state.ui;

// Subject
export const selectCreateSubjectModal = (state) => state.ui.createSubjectModal;
export const selectCreateSubjectModalIsOpen = (state) =>
  state.ui.createSubjectModal.isOpen;

export const selectEditSubjectModal = (state) => state.ui.editSubjectModal;
export const selectEditSubjectModalIsOpen = (state) =>
  state.ui.editSubjectModal.isOpen;
export const selectEditSubjectId = (state) =>
  state.ui.editSubjectModal.subjectId;

// Event Selectors
export const selectCreateEventModal = (state) => state.ui.createEventModal;
export const selectCreateEventModalIsOpen = (state) =>
  state.ui.createEventModal.isOpen;

export const selectEditEventModal = (state) => state.ui.editEventModal;
export const selectEditEventModalIsOpen = (state) =>
  state.ui.editEventModal.isOpen;
export const selectEditEventId = (state) => state.ui.editEventModal.eventId;

export const selectEventDetailModal = (state) => state.ui.eventDetailModal;
export const selectEventDetailModalIsOpen = (state) =>
  state.ui.eventDetailModal.isOpen;
export const selectEventDetailId = (state) => state.ui.eventDetailModal.eventId;

// Queue Selectors
export const selectCreateQueueModal = (state) => state.ui.createQueueModal;
export const selectCreateQueueModalIsOpen = (state) =>
  state.ui.createQueueModal.isOpen;

export const selectEditQueueModal = (state) => state.ui.editQueueModal;
export const selectEditQueueModalIsOpen = (state) =>
  state.ui.editQueueModal.isOpen;
export const selectEditQueueSessionId = (state) =>
  state.ui.editQueueModal.sessionId;

export const selectJoinQueueModal = (state) => state.ui.joinQueueModal;
export const selectJoinQueueModalIsOpen = (state) =>
  state.ui.joinQueueModal.isOpen;
export const selectJoinQueueSessionId = (state) =>
  state.ui.joinQueueModal.sessionId;

export const selectLeaveQueueModalOpen = (state) =>
  state.ui.leaveQueueModal.isOpen;
export const selectLeaveQueueSessionId = (state) =>
  state.ui.leaveQueueModal.sessionId;
export const selectLeaveQueueUsedToken = (state) =>
  state.ui.leaveQueueModal.usedToken;
export const selectLeaveQueueStatus = (state) =>
  state.ui.leaveQueueModal.queueStatus;
export const selectLeaveQueueUserPosition = (state) =>
  state.ui.leaveQueueModal.userPosition;

export const selectQueueDetailModal = (state) => state.ui.queueDetailModal;
export const selectQueueDetailModalIsOpen = (state) =>
  state.ui.queueDetailModal.isOpen;
export const selectQueueDetailSessionId = (state) =>
  state.ui.queueDetailModal.sessionId;

// Calendar Selectors
export const selectCalendarDayPanel = (state) => state.ui.calendarDayPanel;
export const selectCalendarDayPanelIsOpen = (state) =>
  state.ui.calendarDayPanel.isOpen;
export const selectCalendarDayPanelDate = (state) =>
  state.ui.calendarDayPanel.date;
export const selectCalendarDayPanelItems = (state) =>
  state.ui.calendarDayPanel.items;

//CreateOptionsModal Selectors
export const selectCreateOptionsModal = (state) => state.ui.createOptionsModal;
