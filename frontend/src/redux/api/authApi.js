
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userApi } from "./userApi";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl:'http://localhost:4000/api/v1',credentials: "include", }),
   
  endpoints: (builder) => ({

    login: builder.mutation({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
       
          
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          // 1. Wait for the login/register response
          await queryFulfilled; 

          // 2. Trigger getMe and CAPTURE the result
          // forceRefetch is vital so it doesn't use the old 'logged out' cache
          const result = await dispatch(
            userApi.endpoints.getMe.initiate(null, { subscribe: false, forceRefetch: true })
          );

          // 3. Update the userSlice IMMEDIATELY
          if (result.data) {
            dispatch(setUser(result.data)); // Result.data is already just 'user' because of transformResponse
            dispatch(setIsAuthenticated(true));
            dispatch(setLoading(false));
          }
        } catch (error) {
          console.error("Login sync error:", error);
        }
      },
    }),

    register: builder.mutation({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled; 
          await dispatch(userApi.endpoints.getMe.initiate(null));
        } catch (error) {
          console.log(error);
        }
      },
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout()); 
        } catch (error) {
          console.log(error);
        }
      },
    }),

    forgotPassword: builder.mutation({
    query: (body) => ({
    url: "/password/forgot",
    method: "POST",
    body,
     }),
    }),

    resetPassword: builder.mutation({
    query: ({ body, token }) => ({
    url: `/password/reset/${token}`,
    method: "PUT",
    body,
     }),
    }),


  }),
});

export const { useLoginMutation ,useRegisterMutation , useLogoutMutation,useForgotPasswordMutation , useResetPasswordMutation} = authApi;
