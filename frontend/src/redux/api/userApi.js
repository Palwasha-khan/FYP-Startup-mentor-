import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setIsAuthenticated, setLoading, setUser } from "../features/userSlice";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl:  `${import.meta.env.VITE_API_URL}/api/v1` ||'/api',credentials: "include",}),
    tagTypes:["User"],
  endpoints: (builder) => ({

      getMe: builder.query({
        query: () => "/me",
        transformResponse: (res) => res.user,
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(setUser(data));
            dispatch(setIsAuthenticated(true));
            dispatch(setLoading(false));
          } catch (err) {
            // If /me fails (user not logged in), reset state
            dispatch(setUser(null));
            dispatch(setIsAuthenticated(false));
            dispatch(setLoading(false));
          }
        },
        providesTags: ["User"],
      }),

      updateProfile: builder.mutation({
        query(body) {
          return{
            url:"/me/update",
            method:"PUT",
            body,  
          }
       },
       invalidatesTags:["User"],
    }),
     
     updatePassword: builder.mutation({
        query(body) {
          return{
            url:"/password/update",
            method:"PUT",
            body,  
          }
       }, 
       invalidatesTags: ["User"],
    })

  }),
});

export const { useGetMeQuery, useUpdateProfileMutation , useUpdatePasswordMutation} = userApi
