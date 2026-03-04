import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const predictionApi = createApi({
    reducerPath: "predictionApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/api",credentials: "include",}),
    tagTypes: ["Prediction"],
    endpoints: (builder) => ({
        getPrediction: builder.query({
      query: (ideaId) => `/ideas/${ideaId}/prediction`,
      providesTags: ["Prediction"],
    }),        
    }),
});

export const {   useGetPredictionQuery } = predictionApi
