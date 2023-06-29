import { createRoot } from 'react-dom/client';

import { ErrorList } from './error-list';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(<ErrorList details={[{ message: 'Error!' }]} />);
  root.unmount();
});
