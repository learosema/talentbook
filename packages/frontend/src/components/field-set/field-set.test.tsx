import { createRoot } from 'react-dom/client';

import { FieldSet } from './field-set';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(<FieldSet />);
  root.unmount();
});
