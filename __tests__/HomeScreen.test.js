import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { store } from '../src/store';
import HomeScreen from '../src/screens/HomeScreen';

const mockNavigation = {
  navigate: jest.fn(),
};

describe('HomeScreen', () => {
  it('renders device information section', async () => {
    const { getByText } = render(
      <Provider store={store}>
        <HomeScreen navigation={mockNavigation} />
      </Provider>
    );

    await waitFor(() => {
      expect(getByText('Device Information')).toBeTruthy();
      expect(getByText('Notifications')).toBeTruthy();
      expect(getByText('API Data')).toBeTruthy();
    });
  });

  it('displays battery information', async () => {
    const { getByText } = render(
      <Provider store={store}>
        <HomeScreen navigation={mockNavigation} />
      </Provider>
    );

    await waitFor(() => {
      expect(getByText('Battery')).toBeTruthy();
    });
  });
});