import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ideaApi = createApi({
    reducerPath: "ideaApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/api/idea",credentials: "include",}),
    tagTypes: ["Idea"],
    endpoints: (builder) => ({
        submitIdea: builder.mutation({
        query: (body) => ({
        url: "/new",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Idea"],
    }),
        getideas: builder.query({
            query: (params) => "/all",
        }),
    }),
});

export const {   useSubmitIdeaMutation,useGetideasQuery } = ideaApi
