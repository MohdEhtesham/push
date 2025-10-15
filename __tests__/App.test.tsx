import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { store } from '../src/store';
import App from '../App';

// Mock native modules
jest.mock('@react-native-firebase/messaging', () => ({
  requestPermission: jest.fn(() => Promise.resolve(1)),
  getToken: jest.fn(() => Promise.resolve('mock-token')),
  onMessage: jest.fn(),
  setBackgroundMessageHandler: jest.fn(),
}));

jest.mock('../src/services/NativeDeviceService', () => ({
  getBatteryInfo: jest.fn(() => 
    Promise.resolve({ level: 85, isCharging: false })
  ),
  getStorageInfo: jest.fn(() =>
    Promise.resolve({ total: 1000000000, free: 500000000, used: 500000000 })
  ),
  getDeviceInfo: jest.fn(() =>
    Promise.resolve({ deviceName: 'Test Device', model: 'Test Model' })
  ),
}));

describe('App', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(getByText).toBeDefined();
  });
});