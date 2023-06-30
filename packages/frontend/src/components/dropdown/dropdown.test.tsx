import { createRoot } from 'react-dom/client';

import { Dropdown } from './dropdown';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(<Dropdown id="dropdown" value="" onChange={() => {}} />);
  root.unmount();
});
