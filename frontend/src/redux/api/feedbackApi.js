import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const feedbackApi = createApi({
    reducerPath: "feedbackApi",
    baseQuery: fetchBaseQuery({ baseUrl:  `${import.meta.env.VITE_API_URL}/api` ||"/api",credentials: "include",}),
    tagTypes: ["Feedback"],
    endpoints: (builder) => ({
         submitFeedback: builder.mutation({
      query: (body) => ({
        url: "/feedback/submit",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Feedback"],
    }),
        getfeedbacks: builder.query({
            query: (params) => "/feedback/all",
        }),
    }),
});

export const { useGetfeedbacksQuery,useSubmitFeedbackMutation} = feedbackApi
