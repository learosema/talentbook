import { createRoot } from 'react-dom/client';

import { SearchBox } from './search-box';

describe('Search page tests', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(<SearchBox />);
    root.unmount();
  });
});
