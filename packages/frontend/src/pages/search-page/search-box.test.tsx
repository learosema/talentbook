import ReactDOM from 'react-dom';
import { SearchBox } from './search-box';

describe('Search page tests', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SearchBox />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
