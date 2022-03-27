import ReactDOM from 'react-dom';
import { Dropdown } from './dropdown';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Dropdown id="dropdown" value="" onChange={() => {}} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
