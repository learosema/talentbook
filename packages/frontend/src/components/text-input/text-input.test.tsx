import ReactDOM from 'react-dom';
import { TextInput } from './text-input';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TextInput value="" onChange={() => {}} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
