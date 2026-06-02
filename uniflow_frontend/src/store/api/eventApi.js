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
                { type: 'CalendarUpcoming' },
                { type: 'EventList' } // Бродкастимо оновлення списків
            ],
        }),

        deleteEvent: builder.mutation({
            query: (id) => ({ url: `/event/${id}`, method: 'DELETE' }),
            invalidatesTags: (_, __, id) => [
                { type: 'Event', id },
                { type: 'Calendar' },
                { type: 'CalendarUpcoming' },
                { type: 'EventList' }
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