import ReactDOM from 'react-dom';
import { NavMenu } from './index';

jest.mock('react-router-dom', () => ({
  Link: jest.fn().mockImplementation(() => <a></a>),
}));

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<NavMenu />, div);
  ReactDOM.unmountComponentAtNode(div);
});
