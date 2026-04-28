import { apiSlice } from './apiSlice';

export const eventApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getEventsBySubject: builder.query({
            query: (subjectId) => `/event/subject/${subjectId}`,
            providesTags: (_, __, subjectId) => [{ type: 'EventList', id: subjectId }],
        }),

        getEventById: builder.query({
            query: (id) => `/event/${id}`,
            providesTags: (_, __, id) => [{ type: 'Event', id }],
        }),

        createEvent: builder.mutation({
            query: (body) => ({ url: '/event', method: 'POST', body }),
            invalidatesTags: (_, __, { subjectId }) => [
                { type: 'EventList', id: subjectId },
                { type: 'Calendar' },
                { type: 'CalendarUpcoming' },
            ],
        }),

        updateEvent: builder.mutation({
            query: ({ id, ...body }) => ({ url: `/event/${id}`, method: 'PUT', body }),
            invalidatesTags: (_, __, { id }) => [
                { type: 'Event', id },
                { type: 'Calendar' },
                // TODO Переглянути, чи треба інвалідувати цей список при оновленні події
                { type: 'CalendarUpcoming' },
            ],
        }),

        deleteEvent: builder.mutation({
            query: (id) => ({ url: `/event/${id}`, method: 'DELETE' }),
            invalidatesTags: (_, __, id) => [
                { type: 'Event', id },
                { type: 'Calendar' },
                // TODO Переглянути, чи треба інвалідувати цей список при оновленні події
                { type: 'CalendarUpcoming' },
            ],
        }),
    }),
});

export const {
    useGetEventsBySubjectQuery,
    useGetEventByIdQuery,
    useCreateEventMutation,
    useUpdateEventMutation,
    useDeleteEventMutation,
} = eventApi;