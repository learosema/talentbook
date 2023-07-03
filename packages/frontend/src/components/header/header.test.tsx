import { Header } from './header';
import { createRoot } from 'react-dom/client';

jest.mock('react-router-dom', () => ({
  Link: jest.fn().mockImplementation(() => <a></a>),
}));

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(<Header />);
  root.unmount();
});
