import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const contactApi = createApi({
    reducerPath: "contactApi",
    baseQuery: fetchBaseQuery({ baseUrl:'/api',credentials: "include",}),
    tagTypes: ["Contact"],
    endpoints: (builder) => ({
         submitContact: builder.mutation({
      query: (body) => ({
        url: "/contact/submit",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Contact"],
    }),
        
    }),
});

export const { useSubmitContactMutation } = contactApi
