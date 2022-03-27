import ReactDOM from 'react-dom';
jest.mock('../helpers/app-config', () => ({
  AppConfig: {},
}));
import App from './app';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
