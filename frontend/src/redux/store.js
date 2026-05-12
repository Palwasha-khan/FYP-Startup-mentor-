import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice"
import { authApi } from "./api/authApi";
import { feedbackApi } from "./api/feedbackApi";
import { userApi } from "./api/userApi";
import { ideaApi } from "./api/ideaApi";
import { predictionApi } from "./api/predictionApi";
import { contactApi } from "./api/contactApi";

export const store = configureStore({
  reducer: {
    auth: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [feedbackApi.reducerPath]: feedbackApi.reducer,
    [ideaApi.reducerPath]: ideaApi.reducer,
    [predictionApi.reducerPath]: predictionApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([authApi.middleware,feedbackApi.middleware,userApi.middleware,ideaApi.middleware,predictionApi.middleware,contactApi.middleware]),
});
