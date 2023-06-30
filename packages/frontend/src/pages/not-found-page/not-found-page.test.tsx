import { NotFoundPage } from './not-found-page';
import { createRoot } from 'react-dom/client';

jest.mock('react-router-dom', () => ({
  Link: jest.fn().mockImplementation(() => <div></div>),
  useNavigate: jest.fn().mockImplementation(() => () => {}),
}));

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(<NotFoundPage />);
  root.unmount();
});
