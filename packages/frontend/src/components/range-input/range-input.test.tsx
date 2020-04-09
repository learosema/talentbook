import React from 'react';
import ReactDOM from 'react-dom';
import { RangeInput } from './range-input';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <RangeInput value={0} min={0} max={5} onChange={() => {}} />,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
