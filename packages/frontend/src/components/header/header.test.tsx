import React from 'react';
import ReactDOM from 'react-dom';
import { Header } from './header';

jest.mock('react-router-dom', () => ({
  Link: jest.fn().mockImplementation(() => <a></a>),
}));

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Header toggleDarkMode={() => {}} darkMode={false} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
