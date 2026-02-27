import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setIsAuthenticated, setLoading, setUser } from "../features/userSlice";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: "http://localhost:4000/api" ,credentials: "include",}),
    tagTypes:["User"],
  endpoints: (builder) => ({
      getMe: builder.query({
      query: () => "/me",
      transformResponse: (res) => res.user,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const response = await queryFulfilled; // { data: {...user} }
          console.log("queryFulfilled response:", response);
          dispatch(setUser(response.data));
          dispatch(setIsAuthenticated(true));
          dispatch(setLoading(false));
        } catch (err) {
          console.log(err);
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
     
     updatePasssword: builder.mutation({
        query(body) {
          return{
            url:"/password/update",
            method:"PUT",
            body,  
          }
       }, 
    })

  }),
});

export const { useGetMeQuery, useUpdateProfileMutation , useUploadAvatarMutation, useUpdatePassswordMutation} = userApi
