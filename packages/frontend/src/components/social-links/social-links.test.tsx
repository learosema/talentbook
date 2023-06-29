
import { createRoot } from 'react-dom/client';
import { SocialLinks } from './social-links';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(<SocialLinks />);
  root.unmount();
});
