import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import doctorsReducer from "./doctorsSlice";
import appointmentsReducer from "./appointmentsSlice";
import profileReducer from "./profileSlice";
import medicinesReducer from "./medicinesSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    doctors: doctorsReducer,
    appointments: appointmentsReducer,
    profile: profileReducer,
    medicines: medicinesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
