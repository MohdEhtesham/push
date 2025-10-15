import { NativeModules } from "react-native";

const { DeviceInfoModule } = NativeModules;

export default {
  getBatteryLevel: async () => {
    return await DeviceInfoModule.getBatteryLevel();
  },
};
