import { apiSlice } from './apiSlice';

export const subscriptionApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCalendarSettings: builder.query({
            query: () => '/subscriptions/settings',
            providesTags: [{ type: 'Subscriptions' }],
        }),

        toggleAutoAddEvents: builder.mutation({
            query: () => ({ url: '/subscriptions/settings/auto-add-events/toggle', method: 'PUT' }),
            invalidatesTags: [{ type: 'Subscriptions' }],
        }),

        toggleAutoAddQueues: builder.mutation({
            query: () => ({ url: '/subscriptions/settings/auto-add-queues/toggle', method: 'PUT' }),
            invalidatesTags: [{ type: 'Subscriptions' }],
        }),

        toggleSubjectSubscription: builder.mutation({
            query: (subjectId) => ({
                url: `/subscriptions/subjects/${subjectId}/toggle`,
                method: 'POST',
            }),
            invalidatesTags: (_, __, id) => [
                { type: 'Subject', id },
                { type: 'Calendar' },
            ],
        }),

        toggleEventSubscription: builder.mutation({
            query: (eventId) => ({
                url: `/subscriptions/events/${eventId}/toggle`,
                method: 'POST',
            }),
            invalidatesTags: (_, __, id) => [
                { type: 'Event', id },
                { type: 'Calendar' },
            ],
        }),

        toggleQueueSubscription: builder.mutation({
            query: (queueId) => ({
                url: `/subscriptions/queues/${queueId}/toggle`,
                method: 'POST',
            }),
            invalidatesTags: (_, __, id) => [
                { type: 'Queue', id },
                { type: 'Calendar' },
            ],
        }),
    }),
});

export const {
    useGetCalendarSettingsQuery,
    useToggleAutoAddEventsMutation,
    useToggleAutoAddQueuesMutation,
    useToggleSubjectSubscriptionMutation,
    useToggleEventSubscriptionMutation,
    useToggleQueueSubscriptionMutation,
} = subscriptionApi;