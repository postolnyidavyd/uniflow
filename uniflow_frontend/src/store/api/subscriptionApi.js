import { apiSlice } from './apiSlice';

export const subscriptionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCalendarSettings: builder.query({
      query: () => '/subscriptions/settings',
      providesTags: [{ type: 'Subscriptions' }],
    }),

    toggleAutoAddEvents: builder.mutation({
      query: () => ({ url: '/subscriptions/settings/auto-add-events/toggle', method: 'PUT' }),
      invalidatesTags: [{ type: 'Subscriptions' }, { type: 'Calendar' }],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          subscriptionApi.util.updateQueryData('getCalendarSettings', undefined, (draft) => {
            draft.autoAddEvents = !draft.autoAddEvents;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    toggleAutoAddQueues: builder.mutation({
      query: () => ({ url: '/subscriptions/settings/auto-add-queues/toggle', method: 'PUT' }),
      invalidatesTags: [{ type: 'Subscriptions' }, { type: 'Calendar' }],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          subscriptionApi.util.updateQueryData('getCalendarSettings', undefined, (draft) => {
            draft.autoAddQueues = !draft.autoAddQueues;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    toggleSubjectSubscription: builder.mutation({
      query: (subjectId) => ({
        url: `/subscriptions/subjects/${subjectId}/toggle`,
        method: 'POST',
      }),
      invalidatesTags: (_, __, id) => [
        { type: 'Subject', id },
        { type: 'SubjectList' },
        { type: 'Calendar' },
        { type: 'CalendarUpcoming' }
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
        { type: 'CalendarUpcoming' }
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
        { type: 'CalendarUpcoming' }
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