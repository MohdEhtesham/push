import { NativeModules } from 'react-native';

const { DeviceInfoModule } = NativeModules;

export const getBatteryInfo = async () => {
  try {
    const batteryInfo = await DeviceInfoModule.getBatteryLevel();
    console.log('Battery Info:', batteryInfo);
    return batteryInfo;
  } catch (error) {
    console.error('Error getting battery info:', error);
    return { level: -1, isCharging: false };
  }
};

export const getStorageInfo = async () => {
  try {
    const storageInfo = await DeviceInfoModule.getStorageInfo();
    console.log('Storage Info:', storageInfo);
    return storageInfo;
  } catch (error) {
    console.error('Error getting storage info:', error);
    return { total: 0, free: 0, used: 0 };
  }
};

export const getDeviceInfo = async () => {
  try {
    const deviceInfo = await DeviceInfoModule.getDeviceInfo();
    console.log('Device Info:', deviceInfo);
    return deviceInfo;
  } catch (error) {
    console.error('Error getting device info:', error);
    return { deviceName: 'Unknown Device' };
  }
};