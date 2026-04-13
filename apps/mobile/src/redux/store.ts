import { configureStore } from "@reduxjs/toolkit";
import appointmentsReducer from "./appointmentsSlice";
import authReducer from "./authSlice";
import doctorsReducer from "./doctorsSlice";
import medicinesReducer from "./medicinesSlice";
import ordersReducer from "./ordersSlice";
import profileReducer from "./profileSlice";
import healthRecordsReducer from "./healthRecordsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    doctors: doctorsReducer,
    appointments: appointmentsReducer,
    profile: profileReducer,
    medicines: medicinesReducer,
    healthRecords: healthRecordsReducer,
    orders: ordersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
