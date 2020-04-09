import React from 'react';
import ReactDOM from 'react-dom';
import { NotFoundPage } from './not-found-page';

jest.mock('react-router-dom', () => ({
  Link: jest.fn().mockImplementation(() => <div></div>),
}));

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<NotFoundPage />, div);
  ReactDOM.unmountComponentAtNode(div);
});
