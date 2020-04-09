import React from 'react';
import ReactDOM from 'react-dom';
import { initialAppState } from '../../store/app.state';
import { SearchBox } from './search-box';

describe('Search page tests', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <SearchBox dispatch={() => {}} search={initialAppState.search} />,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
