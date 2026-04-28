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
            invalidatesTags: [{ type: 'QueueList' }],
        }),

        updateQueue: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/queue/${id}`, method: 'PUT', body }),
            invalidatesTags: (_, __, { id }) => [
                { type: 'Queue', id },
                { type: 'QueueList' },
            ],
        }),

        deleteQueue: builder.mutation({
            query: (id) => ({ url: `/queue/${id}`, method: 'DELETE' }),
            invalidatesTags: (_, __, id) => [
                { type: 'Queue', id },
                { type: 'QueueList' },
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
                { type: 'Queue', id: sessionId },
            ],
        }),

        leaveQueue: builder.mutation({
            query: (sessionId) => ({ url: `/queue/${sessionId}/leave`, method: 'POST' }),
            invalidatesTags: (_, __, sessionId) => [
                { type: 'MyQueues' },
                { type: 'Queue', id: sessionId },
            ],
        }),

        completeCurrentEntry: builder.mutation({
            query: (sessionId) => ({ url: `/queue/${sessionId}/complete`, method: 'POST' }),
        }),

        skipCurrentEntry: builder.mutation({
            query: (sessionId) => ({ url: `/queue/${sessionId}/skip`, method: 'POST' }),
        }),

        forceCompleteEntry: builder.mutation({
            query: (sessionId) => ({ url: `/queue/${sessionId}/force-complete`, method: 'POST' }),
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