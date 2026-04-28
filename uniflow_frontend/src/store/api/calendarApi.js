import { apiSlice } from './apiSlice';

export const calendarApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMonthlyCalendar: builder.query({
            query: ({ year, month }) => ({ url: '/calendar', params: { year, month } }),
            providesTags: [{ type: 'Calendar' }],
        }),

        getUpcoming: builder.query({
            query: () => '/calendar/upcoming',
            providesTags: [{ type: 'CalendarUpcoming' }],
        }),

        getUpcomingBySubject: builder.query({
            query: (subjectId) => `/calendar/upcoming/subject/${subjectId}`,
            providesTags: (_, __, id) => [{ type: 'CalendarUpcoming', id }],
        }),
    }),
});

export const {
    useGetMonthlyCalendarQuery,
    useGetUpcomingQuery,
    useGetUpcomingBySubjectQuery,
} = calendarApi;