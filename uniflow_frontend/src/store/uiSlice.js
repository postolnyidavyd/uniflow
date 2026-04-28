import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    createSubjectModal: { isOpen: false },
    editSubjectModal: { isOpen: false, subjectId: null },

    createEventModal: { isOpen: false },
    editEventModal: { isOpen: false, eventId: null },
    eventDetailModal: { isOpen: false, eventId: null },

    createQueueModal: { isOpen: false },
    editQueueModal: { isOpen: false, sessionId: null },
    joinQueueModal: { isOpen: false, sessionId: null },
    leaveQueueModal: {
        isOpen: false,
        sessionId: null,
        usedToken: false,
        queueStatus: null,
    },
    queueDetailModal: { isOpen: false, sessionId: null },
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        // Subject
        openCreateSubjectModal(state) {
            state.createSubjectModal.isOpen = true;
        },
        closeCreateSubjectModal(state) {
            state.createSubjectModal.isOpen = false;
        },
        openEditSubjectModal(state, action) {
            state.editSubjectModal = { isOpen: true, subjectId: action.payload };
        },
        closeEditSubjectModal(state) {
            state.editSubjectModal = { isOpen: false, subjectId: null };
        },

        // Event
        openCreateEventModal(state) {
            state.createEventModal = { isOpen: true};
        },
        closeCreateEventModal(state) {
            state.createEventModal = { isOpen: false};
        },
        openEditEventModal(state, action) {
            state.editEventModal = { isOpen: true, eventId: action.payload };
        },
        closeEditEventModal(state) {
            state.editEventModal = { isOpen: false, eventId: null };
        },
        openEventDetailModal(state, action) {
            state.eventDetailModal = { isOpen: true, eventId: action.payload };
        },
        closeEventDetailModal(state) {
            state.eventDetailModal = { isOpen: false, eventId: null };
        },

        // Queue
        openCreateQueueModal(state, ) {
            state.createQueueModal = { isOpen: true };
        },
        closeCreateQueueModal(state) {
            state.createQueueModal = { isOpen: false };
        },
        openEditQueueModal(state, action) {
            state.editQueueModal = { isOpen: true, sessionId: action.payload };
        },
        closeEditQueueModal(state) {
            state.editQueueModal = { isOpen: false, sessionId: null };
        },
        openJoinQueueModal(state, action) {
            state.joinQueueModal = { isOpen: true, sessionId: action.payload };
        },
        closeJoinQueueModal(state) {
            state.joinQueueModal = { isOpen: false, sessionId: null };
        },
        openLeaveQueueModal(state, action) {
            // action.payload: { sessionId, usedToken, queueStatus }
            state.leaveQueueModal = { isOpen: true, ...action.payload };
        },
        closeLeaveQueueModal(state) {
            state.leaveQueueModal = {
                isOpen: false,
                sessionId: null,
                usedToken: false,
                queueStatus: null,
            };
        },
        openQueueDetailModal(state, action) {
            state.queueDetailModal = { isOpen: true, sessionId: action.payload };
        },
        closeQueueDetailModal(state) {
            state.queueDetailModal = { isOpen: false, sessionId: null };
        },
    },
});

export const {
    openCreateSubjectModal, closeCreateSubjectModal,
    openEditSubjectModal, closeEditSubjectModal,
    openCreateEventModal, closeCreateEventModal,
    openEditEventModal, closeEditEventModal,
    openEventDetailModal, closeEventDetailModal,
    openCreateQueueModal, closeCreateQueueModal,
    openEditQueueModal, closeEditQueueModal,
    openJoinQueueModal, closeJoinQueueModal,
    openLeaveQueueModal, closeLeaveQueueModal,
    openQueueDetailModal, closeQueueDetailModal,
} = uiSlice.actions;

export default uiSlice.reducer;