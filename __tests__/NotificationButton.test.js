import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Text, TouchableOpacity} from 'react-native';

function Btn({title, onPress}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
}

test('button calls onPress', () => {
  const onPress = jest.fn();
  const {getByText} = render(<Btn title="Click" onPress={onPress} />);
  fireEvent.press(getByText('Click'));
  expect(onPress).toHaveBeenCalled();
});
