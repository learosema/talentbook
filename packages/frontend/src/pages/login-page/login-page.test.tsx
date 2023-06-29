import { createRoot } from 'react-dom/client';

jest.mock('../../helpers/app-config', () => ({
  AppConfig: {},
}));

import { LoginPage } from './login-page';


describe('Search page tests', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(<LoginPage />);
    root.unmount();
  });
});
