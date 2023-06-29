import { createRoot } from 'react-dom/client';

import { ResultList } from './result-list';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);

  root.render(<ResultList resultData={[]} />);
  root.unmount();
});
