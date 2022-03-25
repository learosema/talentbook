import ReactDOM from 'react-dom';
import { FormField } from './form-field';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FormField label="Name" htmlFor="name" />, div);
  ReactDOM.unmountComponentAtNode(div);
});
