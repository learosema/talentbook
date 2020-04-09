import React from 'react';
import ReactDOM from 'react-dom';
import { TextArea } from './text-area';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TextArea value="" onChange={() => {}} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
