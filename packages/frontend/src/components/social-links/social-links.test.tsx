import ReactDOM from 'react-dom';
import { SocialLinks } from './social-links';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SocialLinks />, div);
  ReactDOM.unmountComponentAtNode(div);
});
