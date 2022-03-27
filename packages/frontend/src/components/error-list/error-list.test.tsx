import ReactDOM from 'react-dom';
import { ErrorList } from './error-list';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ErrorList details={[{ message: 'Error!' }]} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
