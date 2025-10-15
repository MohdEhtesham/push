// src/services/nativeBridge.js
import {NativeModules, Platform} from 'react-native';
const {DeviceInfoModule} = NativeModules;

export async function getBatteryLevel() {
  if (!DeviceInfoModule || !DeviceInfoModule.getBatteryLevel) {
    return Promise.reject('Native module not available');
  }
  // Android kotlin module used Promise, iOS Swift returns Promise as well
  return DeviceInfoModule.getBatteryLevel();
}
