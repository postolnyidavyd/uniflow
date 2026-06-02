import { apiSlice } from './apiSlice';

export const queueApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getQueues: builder.query({
            // params: { page, pageSize, subjectId? }
            query: (params) => ({ url: '/queue', params }),
            providesTags: [{ type: 'QueueList' }],
        }),

        getMyActiveQueues: builder.query({
            query: () => '/queue/my-active',
            providesTags: [{ type: 'MyQueues' }],
        }),

        getQueueById: builder.query({
            query: (id) => `/queue/${id}`,
            providesTags: (_, __, id) => [{ type: 'Queue', id }],
        }),

        getQueueEntries: builder.query({
            query: (sessionId) => `/queue/${sessionId}/entries`,
            providesTags: (_, __, id) => [{ type: 'QueueEntries', id }],
        }),

        createQueue: builder.mutation({
            query: (body) => ({ url: '/queue', method: 'POST', body }),
            invalidatesTags: [
                { type: 'QueueList' },
                { type: 'Calendar' },
                { type: 'CalendarUpcoming' },
            ],
        }),

        updateQueue: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/queue/${id}`, method: 'PUT', body }),
            invalidatesTags: (_, __, { id }) => [
                { type: 'Queue', id },
                { type: 'QueueList' },
                { type: 'Calendar' },
                { type: 'CalendarUpcoming' },
            ],
        }),

        deleteQueue: builder.mutation({
            query: (id) => ({ url: `/queue/${id}`, method: 'DELETE' }),
            invalidatesTags: (_, __, id) => [
                { type: 'Queue', id },
                { type: 'QueueList' },
                { type: 'Calendar' },
                { type: 'CalendarUpcoming' },
            ],
        }),

        joinQueue: builder.mutation({
            // body: { usedToken, submitSecondWork }
            query: ({ sessionId, ...body }) => ({
                url: `/queue/${sessionId}/join`,
                method: 'POST',
                body,
            }),
            invalidatesTags: (_, __, { sessionId }) => [
                { type: 'MyQueues' },
                { type: 'QueueEntries', id: sessionId },
                { type: 'Calendar' },
                { type: 'CalendarUpcoming' },
                { type: 'Balance' }
            ],
        }),

        leaveQueue: builder.mutation({
            query: (sessionId) => ({ url: `/queue/${sessionId}/leave`, method: 'POST' }),
            invalidatesTags: (_, __, sessionId) => [
                { type: 'MyQueues' },
                { type: 'QueueEntries', id: sessionId },
                { type: 'Calendar' },
                { type: 'CalendarUpcoming' },
            ],
        }),

        completeCurrentEntry: builder.mutation({
            query: (sessionId) => ({ url: `/queue/${sessionId}/complete`, method: 'POST' }),
            invalidatesTags: (_, __, sessionId) => [
                { type: 'QueueEntries', id: sessionId },
                { type: 'MyQueues' }
            ],
        }),

        skipCurrentEntry: builder.mutation({
            query: (sessionId) => ({ url: `/queue/${sessionId}/skip`, method: 'POST' }),
            invalidatesTags: (_, __, sessionId) => [
                { type: 'QueueEntries', id: sessionId },
                { type: 'MyQueues' }
            ],
        }),

        forceCompleteEntry: builder.mutation({
            query: (sessionId) => ({ url: `/queue/${sessionId}/force-complete`, method: 'POST' }),
            invalidatesTags: (_, __, sessionId) => [
                { type: 'QueueEntries', id: sessionId },
                { type: 'MyQueues' }
            ],
        }),
    }),
});

export const {
    useGetQueuesQuery,
    useGetMyActiveQueuesQuery,
    useGetQueueByIdQuery,
    useGetQueueEntriesQuery,
    useCreateQueueMutation,
    useUpdateQueueMutation,
    useDeleteQueueMutation,
    useJoinQueueMutation,
    useLeaveQueueMutation,
    useCompleteCurrentEntryMutation,
    useSkipCurrentEntryMutation,
    useForceCompleteEntryMutation,
} = queueApi;