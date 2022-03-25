import ReactDOM from 'react-dom';
import { NotFoundPage } from './not-found-page';

jest.mock('react-router-dom', () => ({
  Link: jest.fn().mockImplementation(() => <div></div>),
  useHistory: jest.fn(),
}));

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<NotFoundPage />, div);
  ReactDOM.unmountComponentAtNode(div);
});
