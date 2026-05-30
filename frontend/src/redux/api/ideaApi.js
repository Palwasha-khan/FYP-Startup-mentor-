import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ideaApi = createApi({
    reducerPath: "ideaApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/api",credentials: "include",}),
    tagTypes: ["Idea"],
    endpoints: (builder) => ({

        submitIdea: builder.mutation({
        query: (body) => ({
        url: "/idea/new",
        method: "POST",
        body,
        }),
        invalidatesTags: ["Idea"],
        }),

        getideas: builder.query({
            query: (params) => "/idea/all",
            providesTags: ["Idea"], 
        }),

        deleteIdea: builder.mutation({
        query: (id) => ({
            url: `/idea/delete/${id}`,
            method: "DELETE",
        }),
        invalidatesTags: ["Idea"],
        }),
    }),
});

export const {   useSubmitIdeaMutation,useGetideasQuery ,useDeleteIdeaMutation} = ideaApi
