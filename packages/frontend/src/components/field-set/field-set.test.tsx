import ReactDOM from 'react-dom';
import { FieldSet } from './field-set';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FieldSet />, div);
  ReactDOM.unmountComponentAtNode(div);
});
