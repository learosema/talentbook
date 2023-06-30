import { createRoot } from 'react-dom/client';

import { NavMenu } from './index';

jest.mock('react-router-dom', () => ({
  Link: jest.fn().mockImplementation(() => <a></a>),
}));

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(<NavMenu />);
  root.unmount();
});
