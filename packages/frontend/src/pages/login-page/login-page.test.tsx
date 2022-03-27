import ReactDOM from 'react-dom';
jest.mock('../../helpers/app-config', () => ({
  AppConfig: {},
}));
import { LoginPage } from './login-page';

describe('Search page tests', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<LoginPage />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
