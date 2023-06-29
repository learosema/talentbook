import { createRoot } from 'react-dom/client';

import { TextInput } from './text-input';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(<TextInput value="" onChange={() => {}} />);
  root.unmount();
});
