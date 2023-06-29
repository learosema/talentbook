import { createRoot } from 'react-dom/client';

import { SearchPage } from './search-page';

describe('Search page tests', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(<SearchPage />);
    root.unmount();
  });
});
