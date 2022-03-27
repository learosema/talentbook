import ReactDOM from 'react-dom';

import { SearchPage } from './search-page';

describe('Search page tests', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SearchPage />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
