import { apiSlice } from './apiSlice';

export const subjectApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubjects: builder.query({
      query: () => '/subject',
      providesTags: [{ type: 'SubjectList' }],
    }),

    getSubjectsShort: builder.query({
      query: () => '/subject/short',
      providesTags: [{ type: 'SubjectList' }],
    }),

    getSubjectById: builder.query({
      query: (id) => `/subject/${id}`,
      providesTags: (_, __, id) => [{ type: 'Subject', id }],
    }),

    getSubjectMarkdown: builder.query({
      query: (id) => `/subject/${id}/markdown`,
      providesTags: (_, __, id) => [{ type: 'Subject', id: `${id}-markdown` }],
    }),

    createSubject: builder.mutation({
      query: (formData) => ({
        url: '/subject',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'SubjectList' }],
    }),

    updateSubject: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/subject/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Subject', id },
        { type: 'SubjectList' },
        { type: 'Calendar' },
        { type: 'CalendarUpcoming' },
      ],
    }),

    updateMarkdown: builder.mutation({
      query: ({ id, markdownContent }) => ({
        url: `/subject/${id}/markdown`,
        method: 'PATCH',
        body: { markdownContent },
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Subject', id }],
    }),

    deleteSubject: builder.mutation({
      query: (id) => ({
        url: `/subject/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [
        { type: 'Subject', id },
        { type: 'SubjectList' },
        { type: 'EventList', id },
        { type: 'QueueList' },
        { type: 'Calendar' },
        { type: 'CalendarUpcoming' },
      ],
    }),
  }),
});

export const {
  useGetSubjectsQuery,
  useGetSubjectsShortQuery,
  useGetSubjectByIdQuery,
  useGetSubjectMarkdownQuery,
  useLazyGetSubjectMarkdownQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useUpdateMarkdownMutation,
  useDeleteSubjectMutation,
} = subjectApi;
