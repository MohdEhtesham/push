import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  batteryInfo: null,
  storageInfo: null,
  deviceInfo: null,
  fcmToken: null,
  apiData: null,
  loading: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
    setBatteryInfo: (state, action) => {
      state.batteryInfo = action.payload;
    },
    setStorageInfo: (state, action) => {
      state.storageInfo = action.payload;
    },
    setDeviceInfo: (state, action) => {
      state.deviceInfo = action.payload;
    },
    setFcmToken: (state, action) => {
      state.fcmToken = action.payload;
    },
    setApiData: (state, action) => {
      state.apiData = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  addNotification,
  setBatteryInfo,
  setStorageInfo,
  setDeviceInfo,
  setFcmToken,
  setApiData,
  setLoading,
  clearNotifications,
} = appSlice.actions;

export default appSlice.reducer;