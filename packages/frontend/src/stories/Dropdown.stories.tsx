import React, { useState } from 'react';
import { Dropdown } from '../components/dropdown/dropdown';

export default {
  title: 'Inputs',
  component: Dropdown,
};
//muh
export const DropdownElement: React.FC = () => {
  const [value, setValue] = useState('');
  return (
    <Dropdown
      id="dropdown"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    >
      <option>Yes</option>
      <option>No</option>
      <option>Maybe</option>
    </Dropdown>
  );
};
