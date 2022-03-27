import ReactDOM from 'react-dom';
import { Toaster } from './toaster';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Toaster />, div);
  ReactDOM.unmountComponentAtNode(div);
});
