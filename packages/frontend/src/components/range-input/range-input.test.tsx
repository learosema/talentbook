import { createRoot } from 'react-dom/client';

import { RangeInput } from './range-input';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(
    <RangeInput value={0} min={0} max={5} onChange={() => {}} />
  );
  root.unmount();
});
