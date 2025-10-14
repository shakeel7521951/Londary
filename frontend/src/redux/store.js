import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// RTK Query APIs
import { userApi } from "./features/usersApi";
import { orderApi } from "./features/ordersApi";
import { couponApi } from "./features/couponsApi";
import { employeeApi } from "./features/employeesApi";
import { dashboardApi } from "./features/dashboardApi";
import authReducer from "./features/authSlice";
import languageReducer from "../redux/features/languageSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  [userApi.reducerPath]: userApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [couponApi.reducerPath]: couponApi.reducer,
  [employeeApi.reducerPath]: employeeApi.reducer,
  [dashboardApi.reducerPath]: dashboardApi.reducer,
  language: languageReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "language"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      userApi.middleware,
      orderApi.middleware,
      couponApi.middleware,
      employeeApi.middleware,
      dashboardApi.middleware
    ),
});

// Create persistor
export const persistor = persistStore(store);

export default store;
