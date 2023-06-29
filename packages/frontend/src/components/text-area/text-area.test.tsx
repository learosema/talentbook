import { createRoot } from 'react-dom/client';

import { TextArea } from './text-area';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div)
  root.render(<TextArea value="" onChange={() => {}} />);
  root.unmount();
});
