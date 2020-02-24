import React, { useState } from 'react';
import { RangeInput } from '../components/range-input/range-input';

export default {
  title: 'Inputs',
  component: RangeInput
};

export const RangeInputField = () => {
  const [value, setValue] = useState(3);
  return (
    <RangeInput
      step={1}
      min={0}
      max={5}
      value={value}
      onChange={e => setValue(parseInt(e.target.value, 10))}
    />
  );
};
