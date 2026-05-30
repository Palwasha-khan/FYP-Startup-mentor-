import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const feedbackApi = createApi({
    reducerPath: "feedbackApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/api",credentials: "include",}),
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
