import React, { useState } from 'react';
import { TextInput } from '../components/text-input/text-input';

export default {
  title: 'Inputs',
  component: TextInput
};

export const DefaultTextField = () => {
  const [value, setValue] = useState('');
  return (<TextInput value={value} onChange={e => setValue(e.target.value)} />);
}