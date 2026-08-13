import { apiSlice } from "../../api/apiSlice";

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: () => '/chat/conversations',
      transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
      providesTags: ['Chat'],
    }),
    getMessages: builder.query({
      query: (conversationId) => `/chat/messages/${conversationId}`,
      transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
      providesTags: (result, error, id) => [{ type: 'Chat', id }],
    }),
    getOrCreateConversation: builder.mutation({
      query: (data) => ({
        url: '/chat/conversations',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
      invalidatesTags: ['Chat'],
    }),
    proposeTerms: builder.mutation({
      query: ({ conversationId, budget, time }) => ({
        url: `/chat/${conversationId}/propose`,
        method: 'PUT',
        body: { budget, time },
      }),
      transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
      invalidatesTags: (result, error, { conversationId }) => [{ type: 'Chat', id: conversationId }, 'Chat'],
    }),
    toggleConfirmation: builder.mutation({
      query: (conversationId) => ({
        url: `/chat/${conversationId}/confirm`,
        method: 'PUT',
      }),
      transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
      invalidatesTags: (result, error, conversationId) => [{ type: 'Chat', id: conversationId }, 'Chat'],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useGetOrCreateConversationMutation,
  useProposeTermsMutation,
  useToggleConfirmationMutation,
} = chatApiSlice;
